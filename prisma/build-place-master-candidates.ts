/**
 * スポットの台帳(place_master)の中身づくり — まとめ案の再生成(2026-10-12)
 *
 * 2026-09-28に一度作った案(docs/content/20260928-spot-master-merge-plan.md)と同じ
 * ルールで、現在の本番データから候補を作り直す(9/28以降に増えたしおりを含めるため)。
 * 入力(_temp-master-candidates.json)は本番のPlaceMaster拡張列に依存しないので、
 * マイグレーション前でも安全に実行できる(Itinerary/Day/Spot/Photo/Areaのみ読む)。
 *
 * 2026-10-12追記: 企画運営・法務の指摘により、(1)公式しおりのみを対象に限定、
 * (2)座標の最大の開きではなく2km以内の鎖状のつながり(single-linkage)で分けるよう変更
 * (同じ名前でも本当に離れた場所は自動で別候補に分け、海岸線・湖岸など自然に広がる
 * 1つの場所は鎖状につながる限りまとめたままにする)、(3)撮影者の表示が実質空の写真を除外。
 *
 * 実行方法: npm run prod -- npx tsx prisma/build-place-master-candidates.ts
 * 出力: prisma/_temp-master-candidates.json, prisma/_temp-master-autosplit.json(自動で分けたもの),
 *       prisma/_temp-master-conflict.json(同名・別都道府県)
 */
import { prisma } from "../src/lib/prisma";
import * as fs from "fs";

const MAX_SPREAD_KM = 2;

// 慰霊の場所(2026-09-28ユーザー了承。admin-site/prisma/fix-memorial-spots.cjsのTARGETSと同じ、
// 13か所・14件)。スポット単位の印は保存のたびに作り直しで消えるため、名前で突き合わせる
const MEMORIAL_NAMES = [
  "飯盛山",
  "原爆ドーム",
  "平和記念公園",
  "大久野島毒ガス資料館",
  "発電所跡",
  "高崎白衣大観音",
  "仁徳天皇陵古墳",
  "天武・持統天皇陵",
  "如意輪寺",
  "泉涌寺",
  "神戸ルミナリエ",
  "知覧特攻平和会館",
  "対馬丸記念館",
];

// 種類の推定(docs/content/20260928-spot-master-merge-plan.mdの決め方と同じ。名前のキーワードによる
// best-effortで、人の目での確認を前提とする)。先に除外語を確かめてから判定する
const CATEGORY_RULES: { cat: string; include: RegExp; exclude?: RegExp }[] = [
  { cat: "castle", include: /城/, exclude: /城下町|城跡資料館/ },
  { cat: "temple", include: /寺|堂/, exclude: /公会堂|会館|議事堂|資料館|記念館|金融資料館|博物館|海岸|岬|浜|丘|高原|渓谷/ },
  { cat: "shrine", include: /神社|神宮|大社|宮(?!殿)/, exclude: /宮殿/ },
  { cat: "mountain", include: /山/, exclude: /庭園|公園|山荘|美術館|博物館|資料館/ },
  { cat: "water", include: /湖|川|滝|渓谷|峡(?!湾)/ },
  { cat: "beach", include: /浜|ビーチ|海岸|岬|崎(?!神社)/ },
  { cat: "onsen", include: /温泉/, exclude: /温泉街|温泉神社/ },
  { cat: "museum", include: /美術館|博物館|資料館|記念館|科学館|水族館|動物園|植物園/ },
  { cat: "townscape", include: /町並み|通り|街道|宿場|横丁/ },
  { cat: "park", include: /公園|庭園/ },
  { cat: "craft", include: /工房|窯元|体験|ガラス工房/ },
  { cat: "view", include: /展望台|展望所|絶景|パノラマ/ },
  { cat: "sake_brewery", include: /酒蔵|酒造/ },
];

// 広い場所の推定(best-effort)
const WIDE_AREA_RE = /高原|半島|渓谷|峠|地区|街$|通り$|エリア|平野|盆地|湾$|諸島|群島|温泉郷|高地/;

function inferCategory(name: string): string | null {
  for (const rule of CATEGORY_RULES) {
    if (rule.exclude && rule.exclude.test(name)) continue;
    if (rule.include.test(name)) return rule.cat;
  }
  return null;
}

function inferIsWideArea(name: string): boolean {
  return WIDE_AREA_RE.test(name);
}

function isMemorialName(canonicalName: string): boolean {
  return MEMORIAL_NAMES.includes(canonicalName);
}

// 丸括弧の中身が「昼食」などの立ち寄りメモの場合、別名として扱わない
// (強い動機: 2026-10-12の確認で、「金森赤レンガ倉庫（昼食）」のような表記が
// そのまま別名「昼食」として台帳候補に入ってしまう不具合を見つけたため)
const NOTE_PAREN_RE = /昼食|夕食|朝食|食事|休憩|散策|自由時間|下車|乗り換え|立ち寄り|見学|入口|出口|駐車場|入場|集合|解散|発|着|経由/;

// 住所から市区町村らしき部分を取り出す(分けた候補の名前の区別用。best-effort)
function extractLocality(address: string | null): string | null {
  if (!address) return null;
  const a = address.replace(/^(日本|〒?\d{3}-?\d{4})/, "").trim();
  let m = a.match(/[^\d　\s]+?郡[^\d　\s]+?[町村]/);
  if (m) return m[0];
  m = a.match(/[^\d　\s]+?市[^\d　\s]*?区/);
  if (m) return m[0];
  m = a.match(/[^\d　\s]+?[市町村]/);
  if (m) return m[0];
  m = a.match(/[^\d　\s]+?区/);
  if (m) return m[0];
  return a.slice(0, 8) || null;
}

const PREFECTURE_PREFIX_RE = /^(北海道|.{2,3}[都道府県])/;

// 住所の都道府県の有無のゆれを吸収して比べるための正規化
// (「栃木県日光市中宮祠」も「日光市中宮祠」も同じ住所として扱う)
function normalizeAddressForCompare(address: string | null): string | null {
  if (!address) return null;
  return address.replace(PREFECTURE_PREFIX_RE, "").trim();
}

// 2km以内でつながらず複数クラスタに分かれても、住所の文字列(都道府県を除く)が
// 完全に一致するなら、GPSの誤差によるばらつきにすぎない同じ場所と判断してまとめ直す
// (2026-10-12、企画運営・法務の指摘を受けた確認で発覚。例:
//  「中禅寺湖」の2つのスポットがどちらも住所「日光市中宮祠」で、座標だけが3km離れていた)
function shouldRemergeByIdenticalAddress<T extends { address: string | null }>(clusters: T[][]): boolean {
  const addrs = clusters
    .map((c) => c.map((m) => normalizeAddressForCompare(m.address)).find((a) => !!a) ?? null)
    .filter((a): a is string => !!a);
  if (addrs.length < 2) return false;
  return addrs.every((a) => a === addrs[0]);
}

// 住所の文字列までは完全一致しないが、同じ市区町村内で、海岸・高原・湖など
// 自然に広がる地形の名前と分かっている場合は、人の目で確かめた上でまとめ直す
// (2026-10-12、企画運営・法務への確認後に追記)
const KNOWN_SAME_PLACE_WIDE_FEATURE = new Set(["七里御浜", "大堂海岸"]);

// 住所が空のため地名を自動で取り出せないが、座標や文脈で場所が分かっているもの
// (スポットの名前+都道府県 → 場所の名前)。2026-10-12、温泉寺(兵庫県)の分割を
// 確かめる過程で、有馬温泉の温泉寺(座標34.796,135.248)と確認した
const KNOWN_LOCALITY_FOR_NO_ADDRESS = new Map<string, string>([["温泉寺|兵庫県|34.79582,135.248225", "神戸市北区有馬町(有馬温泉)"]]);

// 同じ名前+都道府県のグループ内を、2km以内で鎖状につながるかどうかで分ける
// (単純な最大の開きではなく、一筆書きでつながる自然な広がり(海岸線・湖岸・集落など)は
// 1つのまま残し、本当に離れた別の場所(例: 城崎温泉の温泉寺と有馬温泉の温泉寺)だけを分ける)
function clusterBySingleLinkage<T extends { lat: number | null; lng: number | null }>(
  members: T[]
): T[][] {
  const withCoords = members.filter((m) => m.lat !== null && m.lng !== null);
  const withoutCoords = members.filter((m) => m.lat === null || m.lng === null);

  if (withCoords.length <= 1) {
    return withoutCoords.length || withCoords.length ? [[...withCoords, ...withoutCoords]] : [];
  }

  const parent = withCoords.map((_, i) => i);
  function find(i: number): number {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]];
      i = parent[i];
    }
    return i;
  }
  function union(i: number, j: number) {
    const ri = find(i), rj = find(j);
    if (ri !== rj) parent[ri] = rj;
  }
  for (let i = 0; i < withCoords.length; i++) {
    for (let j = i + 1; j < withCoords.length; j++) {
      const d = haversineKm(withCoords[i].lat!, withCoords[i].lng!, withCoords[j].lat!, withCoords[j].lng!);
      if (d <= MAX_SPREAD_KM) union(i, j);
    }
  }
  const clusterMap = new Map<number, T[]>();
  withCoords.forEach((m, i) => {
    const root = find(i);
    if (!clusterMap.has(root)) clusterMap.set(root, []);
    clusterMap.get(root)!.push(m);
  });
  const clusters = [...clusterMap.values()].sort((a, b) => b.length - a.length);
  // 座標のない分は、いちばん大きいクラスタに入れる(どのクラスタか判断できないため)
  if (withoutCoords.length && clusters.length) clusters[0].push(...withoutCoords);
  else if (withoutCoords.length) clusters.push(withoutCoords);
  return clusters;
}

function stripParen(name: string): { canonical: string; alias: string | null } {
  const m = name.match(/^(.*?)[（(]([^）)]+)[）)]\s*$/);
  if (m && m[1].trim()) {
    const inner = m[2].trim();
    const alias = NOTE_PAREN_RE.test(inner) ? null : inner;
    return { canonical: m[1].trim(), alias };
  }
  return { canonical: name.trim(), alias: null };
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function mode<T>(values: T[]): T | null {
  if (values.length === 0) return null;
  const counts = new Map<T, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  let best: T | null = null;
  let bestCount = 0;
  for (const [v, c] of counts) {
    if (c > bestCount) {
      best = v;
      bestCount = c;
    }
  }
  return best;
}

type MemberSpot = {
  spotId: string;
  itineraryId: string;
  itineraryTitle: string;
  itineraryStatus: string;
  rawName: string;
  alias: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  stampCategory: string | null;
  checkinRadius: string | null;
  isMemorial: boolean | null;
  stayDurationMin: number | null;
  websiteUrl: string | null;
  photos: PhotoCand[];
};

type PhotoCand = { url: string; author: string | null; license: string; licenseUrl: string | null; sourceUrl: string };

// 撮影者の表示が実質空(撮影者が分からない)かどうか。バッチ23の指摘(myself./(投稿者)/
// en:user:など、Commonsの説明欄の言い回しをそのまま撮影者として記録してしまう不具合)と
// 同じ考え方で、台帳の写真候補からも除く
const BAD_AUTHOR_RE = /^\s*$|^own work$|^myself\.?$|（投稿者）|^user:|^en:user:/i;

function isUsableAuthor(author: string | null): boolean {
  if (!author) return false;
  return !BAD_AUTHOR_RE.test(author.trim());
}

async function main() {
  const itineraries = await prisma.itinerary.findMany({
    // 台帳は公式しおりのスポットから作る(仕様書1節)。承認待ちの公式しおりも対象に含める
    where: { status: { in: ["published", "pending"] }, plannerAccount: { isOfficial: true } },
    select: {
      id: true,
      title: true,
      status: true,
      primaryArea: { select: { name: true } },
      days: {
        select: {
          spots: {
            select: {
              id: true,
              name: true,
              address: true,
              lat: true,
              lng: true,
              stampCategory: true,
              checkinRadius: true,
              isMemorial: true,
              stayDurationMin: true,
              websiteUrl: true,
              photos: {
                select: { url: true, author: true, license: true, licenseUrl: true, sourceUrl: true },
              },
            },
          },
        },
      },
    },
  });

  console.log(`対象しおり: ${itineraries.length}件`);

  // groupKey = canonicalName + "|" + prefecture
  const groups = new Map<string, { canonicalName: string; prefecture: string; members: MemberSpot[] }>();
  let totalSpots = 0;
  let excludedByAuthor = 0;

  for (const itin of itineraries) {
    const prefecture = itin.primaryArea?.name ?? "不明";
    for (const day of itin.days) {
      for (const spot of day.spots) {
        totalSpots++;
        const { canonical, alias } = stripParen(spot.name);
        const key = `${canonical}|${prefecture}`;
        if (!groups.has(key)) {
          groups.set(key, { canonicalName: canonical, prefecture, members: [] });
        }
        const g = groups.get(key)!;
        const photos: PhotoCand[] = [];
        for (const p of spot.photos) {
          // ライセンス・出典URLに加え、撮影者の表示が実質空でないものだけを候補にする
          // (法務の指摘 2026-10-12。myself./（投稿者）/User:などは撮影者が分からない扱い)
          if (p.license && p.sourceUrl) {
            if (isUsableAuthor(p.author)) {
              photos.push({ url: p.url, author: p.author, license: p.license, licenseUrl: p.licenseUrl, sourceUrl: p.sourceUrl });
            } else {
              excludedByAuthor++;
            }
          }
        }
        g.members.push({
          spotId: spot.id,
          itineraryId: itin.id,
          itineraryTitle: itin.title,
          itineraryStatus: itin.status,
          rawName: spot.name,
          alias,
          address: spot.address,
          lat: spot.lat ? Number(spot.lat) : null,
          lng: spot.lng ? Number(spot.lng) : null,
          stampCategory: spot.stampCategory,
          checkinRadius: spot.checkinRadius,
          isMemorial: spot.isMemorial,
          stayDurationMin: spot.stayDurationMin,
          websiteUrl: spot.websiteUrl,
          photos,
        });
      }
    }
  }

  console.log(`対象スポット: ${totalSpots}件 / 名前+都道府県でのグループ: ${groups.size}件`);

  // 同名・別都道府県の検出(まとめなかった例として記録するだけ、自動ではまとめない)
  const nameToPrefs = new Map<string, Set<string>>();
  for (const g of groups.values()) {
    if (!nameToPrefs.has(g.canonicalName)) nameToPrefs.set(g.canonicalName, new Set());
    nameToPrefs.get(g.canonicalName)!.add(g.prefecture);
  }
  const crossPrefConflicts: { name: string; prefectures: string[] }[] = [];
  for (const [name, prefs] of nameToPrefs) {
    if (prefs.size > 1) crossPrefConflicts.push({ name, prefectures: [...prefs] });
  }

  const candidates: any[] = [];
  const autoSplit: { name: string; prefecture: string; clusterCount: number; localities: string[] }[] = [];
  const remerged: { name: string; prefecture: string; reason: string }[] = [];

  for (const g of groups.values()) {
    let clusters = clusterBySingleLinkage(g.members);

    if (clusters.length > 1) {
      if (shouldRemergeByIdenticalAddress(clusters)) {
        remerged.push({ name: g.canonicalName, prefecture: g.prefecture, reason: "住所の文字列が完全に一致(座標のみのずれ)" });
        clusters = [clusters.flat()];
      } else if (KNOWN_SAME_PLACE_WIDE_FEATURE.has(g.canonicalName)) {
        remerged.push({ name: g.canonicalName, prefecture: g.prefecture, reason: "海岸・高原など自然に広がる地形(人の目で確認ずみ)" });
        clusters = [clusters.flat()];
      }
    }

    const isSplit = clusters.length > 1;

    if (isSplit) {
      autoSplit.push({
        name: g.canonicalName,
        prefecture: g.prefecture,
        clusterCount: clusters.length,
        localities: clusters.map((c) => extractLocality(c.find((m) => m.address)?.address ?? null) ?? "?"),
      });
    }

    clusters.forEach((clusterMembers, idx) => {
      const withCoords = clusterMembers.filter((m) => m.lat !== null && m.lng !== null);
      let maxSpreadKm = 0;
      for (let i = 0; i < withCoords.length; i++) {
        for (let j = i + 1; j < withCoords.length; j++) {
          const d = haversineKm(withCoords[i].lat!, withCoords[i].lng!, withCoords[j].lat!, withCoords[j].lng!);
          if (d > maxSpreadKm) maxSpreadKm = d;
        }
      }

      const aliases = [...new Set(clusterMembers.map((m) => m.alias).filter((a): a is string => !!a))];
      const category =
        mode(clusterMembers.map((m) => m.stampCategory).filter((c): c is string => !!c)) ?? inferCategory(g.canonicalName);
      const isWideArea = clusterMembers.some((m) => m.checkinRadius === "wide") || inferIsWideArea(g.canonicalName);
      const isMemorial = clusterMembers.some((m) => m.isMemorial === true) || isMemorialName(g.canonicalName);
      const stayDurationMin = mode(clusterMembers.map((m) => m.stayDurationMin).filter((d): d is number => d !== null));
      const websiteUrl = clusterMembers.map((m) => m.websiteUrl).find((u) => !!u) ?? null;
      const address = clusterMembers.map((m) => m.address).find((a) => !!a) ?? null;
      const rep = withCoords[0];
      const photos = clusterMembers.flatMap((m) => m.photos);

      // 1つの名前+都道府県が複数のクラスタに分かれた場合、名前が重ならないように
      // 住所から取り出した地名を付ける(登録スクリプトは名前+都道府県で既存を判定するため)
      const knownLocalityKey = rep ? `${g.canonicalName}|${g.prefecture}|${rep.lat},${rep.lng}` : null;
      const fallbackLocality =
        (knownLocalityKey && KNOWN_LOCALITY_FOR_NO_ADDRESS.get(knownLocalityKey)) ?? `候補${idx + 1}`;
      const displayName = isSplit ? `${g.canonicalName}（${extractLocality(address) ?? fallbackLocality}）` : g.canonicalName;

      candidates.push({
        canonicalName: displayName,
        originalName: isSplit ? g.canonicalName : undefined,
        prefecture: g.prefecture,
        memberCount: clusterMembers.length,
        itineraryCount: new Set(clusterMembers.map((m) => m.itineraryId)).size,
        aliases,
        maxSpreadM: Math.round(maxSpreadKm * 1000),
        lat: rep?.lat ?? null,
        lng: rep?.lng ?? null,
        address,
        category,
        isWideArea,
        isMemorial,
        stayDurationMin,
        websiteUrl,
        photos: photos.slice(0, 3),
        memberSpotIds: clusterMembers.map((m) => ({ spotId: m.spotId, itineraryId: m.itineraryId, itineraryTitle: m.itineraryTitle, itineraryStatus: m.itineraryStatus })),
      });
    });
  }

  candidates.sort((a, b) => b.memberCount - a.memberCount);
  autoSplit.sort((a, b) => b.clusterCount - a.clusterCount);

  fs.writeFileSync("prisma/_temp-master-candidates.json", JSON.stringify({ placeCandidates: candidates }, null, 2));
  fs.writeFileSync("prisma/_temp-master-autosplit.json", JSON.stringify({ autoSplit, remerged }, null, 2));
  fs.writeFileSync("prisma/_temp-master-conflict.json", JSON.stringify({ crossPrefConflicts }, null, 2));

  const multi = candidates.filter((c) => c.memberCount > 1).length;
  const withPhoto = candidates.filter((c) => c.photos.length > 0).length;
  const memorialCount = candidates.filter((c) => c.isMemorial).length;
  const wideCount = candidates.filter((c) => c.isWideArea).length;
  const catFound = candidates.filter((c) => c.category).length;

  console.log(`\n台帳の候補: ${candidates.length}件`);
  console.log(`  うち複数スポットをまとめたもの: ${multi}件`);
  console.log(`  写真を1枚以上持てたもの: ${withPhoto}件`);
  console.log(`  撮影者の表示が実質空のため写真候補から外した: ${excludedByAuthor}件`);
  console.log(`  慰霊の場所: ${memorialCount}件`);
  console.log(`  広い場所と推定: ${wideCount}件`);
  console.log(`  種類が分かったもの: ${catFound}件 / 不明 ${candidates.length - catFound}件`);
  console.log(`自動で分けた名前+都道府県(2km以内で鎖状につながらなかったため): ${autoSplit.length}件`);
  console.log(`  うち、住所が一致/自然な地形のためまとめ直した: ${remerged.length}件`);
  console.log(`同名・別都道府県(自動ではまとめず): ${crossPrefConflicts.length}件`);
  console.log("\n出力: prisma/_temp-master-candidates.json / _temp-master-autosplit.json / _temp-master-conflict.json");
}

main().finally(() => prisma.$disconnect());

/**
 * スポットの台帳(place_master)の中身づくり — まとめ案の再生成(2026-10-12)
 *
 * 2026-09-28に一度作った案(docs/content/20260928-spot-master-merge-plan.md)と同じ
 * ルールで、現在の本番データから候補を作り直す(9/28以降に増えたしおりを含めるため)。
 * 入力(_temp-master-candidates.json)は本番のPlaceMaster拡張列に依存しないので、
 * マイグレーション前でも安全に実行できる(Itinerary/Day/Spot/Photo/Areaのみ読む)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/build-place-master-candidates.ts
 * 出力: prisma/_temp-master-candidates.json, prisma/_temp-master-review.json(要確認),
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
  { cat: "temple", include: /寺|堂/, exclude: /公会堂|会館|議事堂|資料館|記念館|金融資料館|博物館/ },
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
};

type PhotoCand = { url: string; author: string | null; license: string; licenseUrl: string | null; sourceUrl: string };

async function main() {
  const itineraries = await prisma.itinerary.findMany({
    where: { status: { in: ["published", "pending"] } },
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
  const groups = new Map<
    string,
    { canonicalName: string; prefecture: string; members: MemberSpot[]; photos: PhotoCand[] }
  >();
  let totalSpots = 0;

  for (const itin of itineraries) {
    const prefecture = itin.primaryArea?.name ?? "不明";
    for (const day of itin.days) {
      for (const spot of day.spots) {
        totalSpots++;
        const { canonical, alias } = stripParen(spot.name);
        const key = `${canonical}|${prefecture}`;
        if (!groups.has(key)) {
          groups.set(key, { canonicalName: canonical, prefecture, members: [], photos: [] });
        }
        const g = groups.get(key)!;
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
        });
        for (const p of spot.photos) {
          if (p.license && p.sourceUrl) {
            g.photos.push({ url: p.url, author: p.author, license: p.license, licenseUrl: p.licenseUrl, sourceUrl: p.sourceUrl });
          }
        }
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
  const review: any[] = [];

  for (const g of groups.values()) {
    const withCoords = g.members.filter((m) => m.lat !== null && m.lng !== null);
    let maxSpreadKm = 0;
    for (let i = 0; i < withCoords.length; i++) {
      for (let j = i + 1; j < withCoords.length; j++) {
        const d = haversineKm(withCoords[i].lat!, withCoords[i].lng!, withCoords[j].lat!, withCoords[j].lng!);
        if (d > maxSpreadKm) maxSpreadKm = d;
      }
    }

    const aliases = [...new Set(g.members.map((m) => m.alias).filter((a): a is string => !!a))];
    // Spot.stampCategory/checkinRadius/isMemorialは保存のたびに作り直しで消えるため実質空。
    // 値があれば優先して使い、なければ名前からのbest-effort推定で補う
    const category =
      mode(g.members.map((m) => m.stampCategory).filter((c): c is string => !!c)) ?? inferCategory(g.canonicalName);
    const isWideArea = g.members.some((m) => m.checkinRadius === "wide") || inferIsWideArea(g.canonicalName);
    const isMemorial = g.members.some((m) => m.isMemorial === true) || isMemorialName(g.canonicalName);
    const stayDurationMin = mode(g.members.map((m) => m.stayDurationMin).filter((d): d is number => d !== null));
    const websiteUrl = g.members.map((m) => m.websiteUrl).find((u) => !!u) ?? null;
    const address = g.members.map((m) => m.address).find((a) => !!a) ?? null;
    // 代表座標: 複数ある場合は最初の非null値(要確認でなければどれも近い)
    const rep = withCoords[0];

    const entry = {
      canonicalName: g.canonicalName,
      prefecture: g.prefecture,
      memberCount: g.members.length,
      itineraryCount: new Set(g.members.map((m) => m.itineraryId)).size,
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
      photos: g.photos.slice(0, 3),
      memberSpotIds: g.members.map((m) => ({ spotId: m.spotId, itineraryId: m.itineraryId, itineraryTitle: m.itineraryTitle, itineraryStatus: m.itineraryStatus })),
    };

    if (maxSpreadKm > MAX_SPREAD_KM) {
      review.push(entry);
    } else {
      candidates.push(entry);
    }
  }

  candidates.sort((a, b) => b.memberCount - a.memberCount);
  review.sort((a, b) => b.maxSpreadM - a.maxSpreadM);

  fs.writeFileSync("prisma/_temp-master-candidates.json", JSON.stringify({ placeCandidates: candidates }, null, 2));
  fs.writeFileSync("prisma/_temp-master-review.json", JSON.stringify({ review }, null, 2));
  fs.writeFileSync("prisma/_temp-master-conflict.json", JSON.stringify({ crossPrefConflicts }, null, 2));

  const multi = candidates.filter((c) => c.memberCount > 1).length;
  const withPhoto = candidates.filter((c) => c.photos.length > 0).length;
  const memorialCount = candidates.filter((c) => c.isMemorial).length;
  const wideCount = candidates.filter((c) => c.isWideArea).length;
  const catFound = candidates.filter((c) => c.category).length;

  console.log(`\n台帳の候補(要確認を除く): ${candidates.length}件`);
  console.log(`  うち複数スポットをまとめたもの: ${multi}件`);
  console.log(`  写真を1枚以上持てたもの: ${withPhoto}件`);
  console.log(`  慰霊の場所: ${memorialCount}件`);
  console.log(`  広い場所と推定: ${wideCount}件`);
  console.log(`  種類が分かったもの: ${catFound}件 / 不明 ${candidates.length - catFound}件`);
  console.log(`要確認(座標が${MAX_SPREAD_KM}km超ばらついた): ${review.length}件`);
  console.log(`同名・別都道府県(自動ではまとめず): ${crossPrefConflicts.length}件`);
  console.log("\n出力: prisma/_temp-master-candidates.json / _temp-master-review.json / _temp-master-conflict.json");
}

main().finally(() => prisma.$disconnect());

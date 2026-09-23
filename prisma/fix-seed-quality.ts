/**
 * 以前のseed（pilot-gen.tsの自動生成）で作った公式しおりのデータ品質を補正する。
 *  1. 閲覧数: ランダムに入れた架空の値を、実際の閲覧記録（PageView）の件数に置き換える
 *  2. 公式サイトURL: 架空・無関係・リンク切れのURLを外す（下記リストは2026-09-24に到達確認した結果）
 *  3. ルート: スポットをランダムに日別へ割り振っていたため、同じ日に数十km離れたスポットが並び、
 *     移動手段も「徒歩8分・徒歩12分・バス15分・徒歩6分」の固定パターンだった。
 *     しおり内のスポットを近い順に並べ直して元の日別件数で分け、距離から移動手段・所要時間・
 *     訪問時刻を計算し直す（検証できない路線名は外す）。
 *  4. 同じスポットを何日も訪れるしおり（2泊以上に多い）は、日程として成り立たないため非公開にする。
 *     ルートの補正はそれ以外のしおりにのみ行う。
 *
 * 紅葉しおり（seed-koyo-2026.ts、ルートを手作りしたもの）とプランナーが作ったしおりは対象外。
 *
 * 実行方法:
 *   npx tsx prisma/fix-seed-quality.ts           … 確認モード（何も変更しない）
 *   npx tsx prisma/fix-seed-quality.ts --commit  … 実行
 */
import { prisma } from "../src/lib/prisma";
import { OFFICIAL_PLANNER_ID } from "./lib/pilot-gen";

// スポットの公式サイトではない（京都市の観光ポータル。京都以外のスポットにも入っていた）
const GENERIC_URLS = ["https://ja.kyoto.travel/"];
// ドメインが存在しない（DNSで解決できない）URL
const NONEXISTENT_HOSTS = [
  "nanshuji.or.jp", "www.nishiki-park.jp", "www.heijo-park.go.jp", "www.rinku-park.com", "sisetu.kunaicho.go.jp",
  "www.okochi-sanso.jp", "tsuboya-museum.naha.okinawa.jp", "www.uji-genji.jp", "shakotan-guide.com", "otarumuse.jp",
  "www.hakodate-goryokaku.jp", "hakodate-orthodox-church.com", "tenjinbashi.or.jp", "www.ohatujitenjin.com",
  "www.shinsekai-net.jp", "www.denden-town.or.jp", "abenoq.com", "chikurin.co.jp", "saifukuoka.jp",
];
// サイトはあるがページが存在しない（404）URL
const NOT_FOUND_URLS = [
  "https://www.city.sakai.lg.jp/museum/", "https://www.zaidan-hakodate.com/kokaido/", "https://www.shochiku.co.jp/play/theater/104/",
  "https://www.tennoji-park.jp/tenshiba/", "https://www.shijou.metro.tokyo.lg.jp/toyosu/", "https://www.city.mitaka.lg.jp/yamamotoyuzo/",
  "https://www.tokyo-park.or.jp/park/kaihin/", "https://www.mojiko.info/kaikyo/",
];

// エリアごとの主な移動手段（徒歩圏を超える区間に使う）
const TRAIN_AREAS = [
  "京都市内（清水・祇園・河原町）", "伏見・宇治", "札幌市内", "函館", "梅田・大阪駅周辺", "難波・道頓堀", "天王寺・あべの",
  "堺・泉南", "浅草・上野", "渋谷・原宿", "お台場・臨海副都心", "吉祥寺・三鷹", "福岡市内", "太宰府",
];
const CAR_AREAS = ["小樽・積丹", "富良野・美瑛", "天橋立・丹後", "吉野"];

const WALK_MAX_KM = 1.2;
const DAY_START_MIN = 9 * 60;

type SpotRow = { id: string; name: string; lat: number; lng: number; stay: number; dayNumber: number; orderNo: number };

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const rad = Math.PI / 180;
  const h = Math.sin(((b.lat - a.lat) * rad) / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(((b.lng - a.lng) * rad) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

const round5 = (min: number) => Math.max(5, Math.round(min / 5) * 5);

// 直線距離から移動手段と所要時間を概算する（道のりは直線の約1.3倍、駅・バス停までの徒歩や待ち時間も加味）
function estimateTransit(km: number, profile: "train" | "car" | "bus"): { mode: string; min: number } {
  if (km <= WALK_MAX_KM) return { mode: "walk", min: round5((km * 1.3) / 0.075) };
  if (profile === "car") return { mode: "car", min: round5(5 + km * 1.5) };
  if (profile === "train") return { mode: "train", min: round5(8 + km * 2.2) };
  return { mode: "bus", min: round5(8 + km * 3) };
}

// 最初のスポットを起点に、最も近いスポットを順につなぎ、2-optで交差（遠回り）を解消する
function orderByProximity(spots: SpotRow[]): SpotRow[] {
  const rest = spots.slice(1);
  const route = [spots[0]];
  while (rest.length) {
    const last = route[route.length - 1];
    let best = 0;
    for (let i = 1; i < rest.length; i++) if (distanceKm(last, rest[i]) < distanceKm(last, rest[best])) best = i;
    route.push(rest.splice(best, 1)[0]);
  }
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 1; i < route.length - 2; i++) {
      for (let j = i + 1; j < route.length - 1; j++) {
        const before = distanceKm(route[i - 1], route[i]) + distanceKm(route[j], route[j + 1]);
        const after = distanceKm(route[i - 1], route[j]) + distanceKm(route[i], route[j + 1]);
        if (after < before - 1e-6) {
          route.splice(i, j - i + 1, ...route.slice(i, j + 1).reverse());
          improved = true;
        }
      }
    }
  }
  return route;
}

const fmt = (min: number) => `${Math.floor(min / 60)}:${String(min % 60).padStart(2, "0")}`;

async function main() {
  const commit = process.argv.includes("--commit");
  console.log(commit ? "実行モード" : "確認モード（何も変更しません）");

  const itineraries = await prisma.itinerary.findMany({
    where: {
      plannerAccountId: OFFICIAL_PLANNER_ID,
      NOT: { purposeTags: { some: { purposeTag: { name: "紅葉狩り" } } } },
    },
    select: {
      id: true,
      title: true,
      viewCount: true,
      areas: { select: { area: { select: { name: true, level: true } } } },
      _count: { select: { pageViews: true } },
      days: {
        orderBy: { dayNumber: "asc" },
        select: {
          id: true,
          dayNumber: true,
          spots: { orderBy: { orderNo: "asc" }, select: { id: true, name: true, lat: true, lng: true, stayDurationMin: true, orderNo: true, websiteUrl: true } },
        },
      },
    },
  });
  console.log(`対象しおり: ${itineraries.length}件`);

  // --- 1. 閲覧数 ---
  const viewChanges = itineraries.filter((it) => it.viewCount !== BigInt(it._count.pageViews));
  console.log(`\n[閲覧数] 実際の閲覧記録に置き換え: ${viewChanges.length}件（例: ${viewChanges.slice(0, 3).map((it) => `${it.viewCount}→${it._count.pageViews}`).join(", ")}）`);

  // --- 2. URL ---
  const isBadUrl = (u: string) =>
    GENERIC_URLS.includes(u) || NOT_FOUND_URLS.includes(u) || NONEXISTENT_HOSTS.includes(new URL(u).host);
  const allSpots = itineraries.flatMap((it) => it.days.flatMap((d) => d.spots));
  const badUrlSpots = allSpots.filter((s) => s.websiteUrl && isBadUrl(s.websiteUrl));
  console.log(`[URL] 外すスポット: ${badUrlSpots.length}件 / URL登録済み ${allSpots.filter((s) => s.websiteUrl).length}件`);

  // --- 3. 同じスポットを何日も訪れるしおり ---
  // エリアのスポット候補（10〜15件）より多い枠を埋めるためにスポットを使い回していたもの（2泊以上に多い）。
  // 日程として成り立たないため非公開にする（データは残し、作り直せるようにする）。
  const hasDuplicateSpots = (it: (typeof itineraries)[number]) => {
    const names = it.days.flatMap((d) => d.spots.map((s) => s.name));
    return new Set(names).size < names.length;
  };
  const duplicated = itineraries.filter(hasDuplicateSpots);
  console.log(`[重複] 同じスポットを複数回含むため非公開にする: ${duplicated.length}件`);

  // --- 4. ルート（重複のないしおりのみ） ---
  let beforeKm = 0;
  let afterKm = 0;
  let longLegsBefore = 0;
  let longLegsAfter = 0;
  const modeCount: Record<string, number> = {};
  const lateDays: string[] = [];
  const plans: { itineraryId: string; updates: { spotId: string; dayId: string; orderNo: number; visitMin: number; transit: { mode: string; min: number } | null }[] }[] = [];

  for (const it of itineraries.filter((it) => !hasDuplicateSpots(it))) {
    const subAreas = it.areas.filter((a) => a.area.level === "area").map((a) => a.area.name);
    const profile = subAreas.some((a) => CAR_AREAS.includes(a)) ? "car" : subAreas.some((a) => TRAIN_AREAS.includes(a)) ? "train" : "bus";

    const spots: SpotRow[] = it.days.flatMap((d) =>
      d.spots.map((s) => ({ id: s.id, name: s.name, lat: Number(s.lat), lng: Number(s.lng), stay: s.stayDurationMin ?? 60, dayNumber: d.dayNumber, orderNo: s.orderNo })),
    );
    for (const d of it.days) for (let i = 1; i < d.spots.length; i++) {
      const km = distanceKm({ lat: Number(d.spots[i - 1].lat), lng: Number(d.spots[i - 1].lng) }, { lat: Number(d.spots[i].lat), lng: Number(d.spots[i].lng) });
      beforeKm += km;
      if (km > 3) longLegsBefore++;
    }

    const route = orderByProximity(spots);
    const updates: (typeof plans)[number]["updates"] = [];
    let cursor = 0;
    for (const day of it.days) {
      const daySpots = route.slice(cursor, cursor + day.spots.length);
      cursor += day.spots.length;
      let clock = DAY_START_MIN;
      daySpots.forEach((s, idx) => {
        let transit: { mode: string; min: number } | null = null;
        if (idx > 0) {
          const km = distanceKm(daySpots[idx - 1], s);
          afterKm += km;
          if (km > 3) longLegsAfter++;
          transit = estimateTransit(km, profile);
          modeCount[transit.mode] = (modeCount[transit.mode] ?? 0) + 1;
          clock += daySpots[idx - 1].stay + transit.min;
        }
        updates.push({ spotId: s.id, dayId: day.id, orderNo: idx + 1, visitMin: clock, transit });
      });
      const end = clock + (daySpots[daySpots.length - 1]?.stay ?? 0);
      if (end > 19 * 60) lateDays.push(`${it.title.slice(0, 18)}… Day${day.dayNumber} 終了${fmt(end)}`);
    }
    plans.push({ itineraryId: it.id, updates });
  }
  console.log(`[ルート] 同じ日の移動距離の合計: ${beforeKm.toFixed(0)}km → ${afterKm.toFixed(0)}km、3km超の区間: ${longLegsBefore} → ${longLegsAfter}`);
  console.log(`         移動手段の内訳: ${JSON.stringify(modeCount)}`);
  console.log(`         19時を過ぎる日: ${lateDays.length}日`);
  lateDays.slice(0, 5).forEach((d) => console.log(`           ${d}`));

  // 例として1件のしおりの変更後ルートを表示
  const sample = itineraries.find((it) => !hasDuplicateSpots(it) && it.days.length === 2) ?? itineraries[0];
  const samplePlan = plans.find((p) => p.itineraryId === sample.id)!;
  const nameById = new Map(allSpots.map((s) => [s.id, s.name]));
  console.log(`\n例: ${sample.title}`);
  for (const u of samplePlan.updates) {
    if (u.orderNo === 1) console.log(`  Day${sample.days.find((d) => d.id === u.dayId)!.dayNumber}`);
    console.log(`    ${u.transit ? `${u.transit.mode} ${u.transit.min}分 → ` : ""}${fmt(u.visitMin)} ${nameById.get(u.spotId)}`);
  }

  if (!commit) return;

  for (const it of viewChanges) {
    await prisma.itinerary.update({ where: { id: it.id }, data: { viewCount: BigInt(it._count.pageViews) } });
  }
  await prisma.spot.updateMany({ where: { id: { in: badUrlSpots.map((s) => s.id) } }, data: { websiteUrl: null } });
  await prisma.itinerary.updateMany({ where: { id: { in: duplicated.map((it) => it.id) } }, data: { status: "private" } });

  for (const plan of plans) {
    await prisma.$transaction(async (tx) => {
      // (day_id, order_no) の一意制約に当たらないよう、いったん仮の番号に退避してから並べ替える
      for (const u of plan.updates) await tx.spot.update({ where: { id: u.spotId }, data: { orderNo: 1000 + u.orderNo + plan.updates.indexOf(u) } });
      for (const u of plan.updates) {
        await tx.spot.update({
          where: { id: u.spotId },
          data: {
            dayId: u.dayId,
            orderNo: u.orderNo,
            visitTime: new Date(Date.UTC(1970, 0, 1, Math.floor(u.visitMin / 60), u.visitMin % 60)),
            transitMode: u.transit?.mode ?? null,
            transitDurationMin: u.transit?.min ?? null,
            transitLine: null,
          },
        });
      }
    }, { timeout: 60000 });
  }
  console.log(`\n反映しました（閲覧数 ${viewChanges.length}件、URL ${badUrlSpots.length}件、非公開 ${duplicated.length}件、ルート ${plans.length}件）`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

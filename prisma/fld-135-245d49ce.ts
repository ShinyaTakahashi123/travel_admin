/**
 * 初日・最終日の見直し #135 245d49ce「広島市現代美術館と八丁堀、街なかアートとグルメの1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（最終日は1泊2日なので今のまま）
 * いまの初日（6か所）: 広島市郷土資料館 9:30 → 広島市現代美術館 → まんが図書館 → 八丁堀（昼食）→ 中工場 → 江波山気象館 15:45〜16:30
 * 直した初日（5か所）: 広島駅に11時ごろ → 路面電車で比治山下 → 広島市現代美術館 11:20 → まんが図書館 → 八丁堀（昼食 13:23〜）→ 中工場 → 江波山気象館 15:51〜16:36
 *   郷土資料館を外す（宇品で、比治山とは反対の方向。タイトル・説明文に出てこない。写真なし。後ろの日も入れる時間がない）
 *   入口と1か所目: 広電の5号線（広島駅−比治山下−広島港）は 広島駅・稲荷町・松川町・比治山下 の順（hiroden.co.jp/cgi-bin/rlist.cgi?l=r05。2025年8月の駅前大橋ルートの開業で経路が変わった）
 *   比治山下→八丁堀: 5号線は的場町を通らなくなったので「的場町で乗り換えて」を「稲荷町で乗り換えて」に直す（比治山下から乗れるのは 5号線と循環線（hiroden.co.jp/train/route-guide/stop-guide/h02.html））
 *   移動の時間は延ばさず、滞在を短くした（現代美術館 80→70分、まんが図書館 37→30分、中工場 42→40分）
 *   閉まる時刻（決まり7）: 中工場のエコリアム 9:00〜16:30（dive-hiroshima.com/explore/2011/）→ 15:36 に出る。
 *     江波山気象館 9:00〜17:00・入館16:30まで（city.hiroshima.lg.jp/soshiki/46/11500.html）→ 15:51 に着く
 * 座標（itinerary-rules 7章）: 中工場 → OSM way 1334352448「広島市環境局中工場」（いまの点は名前つきの地物と合わない）。ほかは OSM の点と一致
 * 説明文・タイトル・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-135-245d49ce.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "245d49ce-4687-4b42-ac4c-f62e5d2c6072";
const DAY1_ID = "0157db9d-99c1-47d4-bd72-3be9e1d28d8c";
const KYODO = "3c1de636-5fbc-4f79-ba86-915284cc4ca9";
const MOCA = "c1271413-0d63-40a2-90b2-c91d0609cbe3";
const MANGA = "ace5ca5b-8f5e-4be9-b039-f7c20f23ae1a";
const HATCHOBORI = "bf2ac218-9bdf-4cbf-a5c8-c3f303cf5122";
const NAKA = "4b9966d7-57a6-416e-929a-c27a2abd65d0";
const EBAYAMA = "0a6f53ad-5be3-4f8c-8156-49f2aad16bac";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const train = (min: number, line: string) => ({ mode: "train" as const, min, line });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [MOCA]: [
    {
      from: "宇品二丁目から路面電車で比治山下へ行き、坂を上って歩いて約8分（あわせて約25分）。",
      to: "この旅は歩きと路面電車などでめぐります。広島駅に11時ごろ着いたら、路面電車の5号線（広島港行き）で比治山下へ行き、坂を上って歩いて約8分（あわせて約20分）。",
    },
  ],
  [HATCHOBORI]: [{ from: "比治山下から路面電車に乗り、的場町で乗り換えて八丁堀へ", to: "比治山下から路面電車に乗り、稲荷町で乗り換えて八丁堀へ" }],
};

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [{ id: NAKA, from: [34.358875, 132.442627], to: [34.358492, 132.442261] }];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: MOCA, h: 11, m: 20, stay: 70, legs: [] },
  { id: MANGA, h: 12, m: 33, stay: 30, legs: [walk(3)] },
  { id: HATCHOBORI, h: 13, m: 23, stay: 50, legs: [walk(8), train(12, "広島電鉄（比治山下→稲荷町→八丁堀）")] },
  { id: NAKA, h: 14, m: 56, stay: 40, legs: [walk(3), train(20, "広島電鉄（八丁堀→舟入南町）"), walk(20)] },
  { id: EBAYAMA, h: 15, m: 51, stay: 45, legs: [walk(15)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [KYODO, MOCA, MANGA, HATCHOBORI, NAKA, EBAYAMA].join()) throw new Error("1日目の構成が想定と違います");
  for (const s of d1.spots.filter((x) => x.id === KYODO)) if (s.photos.length) throw new Error(`外すスポットに写真があります: ${s.name}`);
  const memoOf = (id: string) => {
    let m = d1.spots.find((s) => s.id === id)!.memo ?? "";
    for (const e of MEMO_EDITS[id] ?? []) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const DAY1 = PLAN.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: memoOf(p.id) } : {}) } }));
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  for (const p of PLAN) {
    const st = p.h * 60 + p.m;
    const min = p.legs.reduce((a, l) => a + l.min, 0);
    const s = d1.spots.find((x) => x.id === p.id)!;
    console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分）${MEMO_EDITS[p.id] ? "\n  本文: " + memoOf(p.id) : "（本文は変えない）"}`);
    prevEnd = st + p.stay;
  }
  const allSpots = it.days.flatMap((d) => d.spots);
  for (const c of COORDS) {
    const s = allSpots.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`\n座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  console.log(`\n外すスポット: ${KYODO}（広島市郷土資料館）`);
  console.log(`\n説明文は変えない: ${it.description}`);
  console.log("\n2日目は変えない（1泊2日の最終日）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx, remove: [KYODO] });
      for (const c of COORDS) await tx.spot.update({ where: { id: c.id }, data: { lat: c.to[0], lng: c.to[1] } });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

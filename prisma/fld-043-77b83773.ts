/**
 * 初日・最終日の見直し #43 77b83773「彦根城と湖東三山の紅葉、永源寺と多賀大社もめぐる1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 18:38、#37〜#44 は制作補助2。季節は秋だけ）
 * 歩きは routed-foot、車は routed-car（もとの値が ×1.5＋5 の内側ならそのまま、外れる区間・新しい区間は切り上げ＋5、歩きは切り上げ）
 * 1日目: JR彦根駅 10:40ごろ → 歩22（1,597m。もと15）→ 彦根城 11:02（100→70）→ 歩10（718m。もと5）→ 玄宮園 12:22（45→30）→ 歩7（477m、もとのまま）→ 埋木舎 12:59（30→15）→
 *   歩13（895m、もとのまま）→ 夢京橋キャッスルロード（昼食）13:27〜14:07（50→40）→ 歩19（1,385m。もと15）で彦根駅＋レンタカー（手続き15分）＋車21（12.2km。もと30）→
 *   西明寺 15:02（60→50）→ 車10（3.9km、もとのまま）→ 金剛輪寺 16:02〜16:57（55。拝観は 17:00 まで）→ 車30（15.9km、もとのまま）で彦根の宿
 * 2日目（もとは 16:35 に出る。そのまま）: 宿 → 車50（彦根駅から 35.7km、もとのまま）→ 永源寺 9:30（70）→ 車22（11.9km。もと15）→ 百済寺 11:02（80）→ 車30（17.4km、もとのまま）→
 *   多賀大社の門前（昼食）12:52〜13:32（50→40）→ 歩3（161m。もと2）→ 多賀大社 13:35（90→89）→ 車20（8.9km、もとのまま）で桜場駐車場（OSM way 378180192）＋歩11（771m。もと8）→
 *   彦根城博物館 15:35〜16:35（60）→ 歩11で駐車場＋車10（1.5km）で彦根駅、レンタカーを返す（15分）
 * 点: 彦根城＝Nominatim「彦根城」way 363244224（天守の建物、historic=castle。35.2764830,136.2518607。いまは天守の約60m北）／
 *   玄宮園＝OSM「玄宮園」leisure=garden way 585543133 の南の頂点 node 10284679651（いまは庭園の面の中）／
 *   夢京橋キャッスルロード（昼食）＝OSM「夢京橋キャッスルロード」way 180831396 の頂点 node 1371999866（いまの点から約9m）／
 *   多賀大社の門前（昼食）＝OSM「絵馬通り」way 123676161 の頂点 node 1378269019（いまの点から約30m）
 *   埋木舎（node 582527746）・西明寺・金剛輪寺・百済寺・多賀大社（way、Nominatim）・永源寺（node 1939667916）・彦根城博物館（way 363244231、Nominatim）はいまの点のまま
 * 多賀の昼食: 滋賀県の観光公式サイト https://ja.biwako-visitors.jp/spot/detail/222?active=eat「多賀大社前にはカフェや飲食店が並んでいます。」（糸切餅の店はこのページになく、文から外す）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-043-77b83773.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "77b83773-6635-47f0-a22b-ec99cf45b91e";
const DAY1_ID = "2c6b06c6-2bfd-434b-b50e-fa061487cc27";
const DAY2_ID = "700c33db-968b-42e4-8415-6aa2190fd7ba";
const HIKONE = "59906d9e-c817-4fe8-a032-95da5cf2ee71";
const GENKYU = "34559022-5293-46a2-8ba8-2c2925d7842c";
const UMOREGI = "012d41c4-6a1d-4621-870c-8e9a6d002f48";
const LUNCH1 = "d495ec46-12a9-4483-9427-a42fbf3f303a";
const SAIMYO = "f77df4e0-6dee-401e-8506-7d7a47cceb4e";
const KONGO = "03e5b130-94b2-4f30-960c-63f83e0e7f64";
const EIGEN = "490b88ca-d95c-40f8-84d8-6b7f887d4a1a";
const HYAKUSAI = "03dda8a9-c654-4592-92bf-dc25b2cc9177";
const LUNCH2 = "0278a52d-32c4-4dbe-995e-fd6afd371f79";
const TAGA = "062b6e6b-5dd2-46f6-93cc-9a070f4ff62a";
const MUSEUM = "6be173b1-eb4b-416a-a014-44b540625d26";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const car = (min: number) => ({ mode: "car" as const, min });
const other = (min: number, line: string) => ({ mode: "other" as const, min, line });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [HIKONE]: { from: [35.277101, 136.251717], to: [35.276483, 136.2518607] },
  [GENKYU]: { from: [35.278383, 136.254043], to: [35.2772649, 136.2543986] },
  [LUNCH1]: { from: [35.271042, 136.251558], to: [35.2709691, 136.2515038] },
  [LUNCH2]: { from: [35.22477, 136.289354], to: [35.2246473, 136.2896551] },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [HIKONE]: [{ from: "1日目の午前は歩いてめぐります。JR彦根駅から歩いて約15分。", to: "JR彦根駅に10時40分ごろ着いたら、歩いて約22分、彦根城の天守から旅を始めます。1日目の昼までは歩いてめぐります。" }],
  [GENKYU]: [{ from: "彦根城から歩いて約5分。", to: "彦根城から歩いて約10分。" }],
  [SAIMYO]: [
    {
      from: "キャッスルロードから彦根駅へ歩いて約15分、駅の近くでレンタカーを借りて、車で約30分（あわせて約45分）。",
      to: "キャッスルロードから彦根駅へ歩いて約19分、駅の近くでレンタカーを借りて（手続きに約15分）、車で約21分（あわせて約55分）。",
    },
  ],
  [HYAKUSAI]: [{ from: "永源寺から車で約15分。", to: "永源寺から車で約22分。" }],
  [LUNCH2]: [{ from: "まわりには名物の糸切餅の店や食事の店があるので、ここで昼食にしましょう。", to: "多賀大社の前にはカフェや食事の店が並ぶので、ここで昼食にしましょう。" }],
  [TAGA]: [{ from: "門前から歩いてすぐ。", to: "門前から歩いて約3分。" }],
  [MUSEUM]: [
    { from: "多賀大社から車で約20分、彦根城のそばの駐車場から歩いて約8分（あわせて約28分）。", to: "多賀大社から車で約20分、彦根城のそばの桜場駐車場から歩いて約11分（あわせて約31分）。" },
    { from: "帰りは、車で彦根駅へ戻り、車を返しましょう。", to: "見学を終えたら、歩いて約11分で駐車場に戻り、車で約10分の彦根駅でレンタカーを返しましょう（返す手続きに約15分）。" },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: HIKONE, h: 11, m: 2, stay: 70, legs: [] },
  { id: GENKYU, h: 12, m: 22, stay: 30, legs: [walk(10)] },
  { id: UMOREGI, h: 12, m: 59, stay: 15, legs: [walk(7)] },
  { id: LUNCH1, h: 13, m: 27, stay: 40, legs: [walk(13)] },
  { id: SAIMYO, h: 15, m: 2, stay: 50, legs: [walk(19), other(15, "レンタカーの手続き"), car(21)] },
  { id: KONGO, h: 16, m: 2, stay: 55, legs: [car(10)] },
];
const DAY2: Plan = [
  { id: EIGEN, h: 9, m: 30, stay: 70, legs: [] },
  { id: HYAKUSAI, h: 11, m: 2, stay: 80, legs: [car(22)] },
  { id: LUNCH2, h: 12, m: 52, stay: 40, legs: [car(30)] },
  { id: TAGA, h: 13, m: 35, stay: 89, legs: [walk(3)] },
  { id: MUSEUM, h: 15, m: 35, stay: 60, legs: [car(20), walk(11)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== DAY1.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2.map((p) => p.id).join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  for (const [id, c] of Object.entries(COORDS)) {
    const s = all.find((x) => x.id === id)!;
    if (Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${s.name}: いまの座標が想定と違います（${s.lat},${s.lng}）`);
  }
  const memos: Record<string, string> = {};
  for (const [id, edits] of Object.entries(MEMO_EDITS)) {
    const s = all.find((x) => x.id === id)!;
    let m = s.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${s.name}: 置き換え元が見つかりません: ${e.from.slice(0, 24)}`);
      m = m.replace(e.from, e.to);
    }
    memos[id] = m;
  }
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "すぐ", "ホテル", "旅館", "締めくくり", "午前"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」があります`));
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const show = (label: string, plan: Plan) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = all.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分 ${s.transitLegs.map((l) => l.transitMode + l.transitDurationMin).join("+") || "-"}）${s.stayDurationMin != null && p.stay > s.stayDurationMin ? " ⚠滞在がもとより長い" : ""}`);
      if (COORDS[p.id]) console.log(`  座標 ${COORDS[p.id].from.join(",")} → ${COORDS[p.id].to.join(",")}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", DAY1);
  show("2日目（直したあと）", DAY2);
  console.log("\n直したメモ:");
  for (const [id, m] of Object.entries(memos)) console.log(`■ ${all.find((x) => x.id === id)!.name}\n${m}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = (plan: Plan) =>
    plan.map((p) => ({
      id: p.id,
      data: {
        ...timeLegs(p.h, p.m, p.stay, p.legs),
        ...(memos[p.id] !== undefined ? { memo: memos[p.id] } : {}),
        ...(COORDS[p.id] ? { lat: COORDS[p.id].to[0], lng: COORDS[p.id].to[1] } : {}),
      },
    }));
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx });
      await setDaySpotOrder(DAY2_ID, items(DAY2) as never, { tx });
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

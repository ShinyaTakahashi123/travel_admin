/**
 * 初日・最終日の見直し #117 043809ae「真栄田岬の青の洞窟、シュノーケリングで海中世界を楽しむ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 10時ごろ、#110〜#123 は制作補助2）
 * 車は OSRM、歩きは routed-foot（もとの値が実測より短い区間は切り上げ＋5、歩きは切り上げ）
 * 1日目: 那覇空港 10:30ごろ → レンタカー（手続き15分）→ 車59（OSRM 53.9。遠い場所の例外で 11:45 まで）→ 真栄田岬 11:44（100→80）→ 車16（10.8。もと6）→
 *   タイガービーチ 13:20〜14:30（昼食とシュノーケリング、90→70）→ 車7（935m・2.0。もと歩8。車はタイガービーチにとめているので車で動く、企画運営）→ ムーンビーチ 14:37（100→50）→ 車22（16.7。もと16）→
 *   万座ビーチ 15:49〜16:49（100→60）→ 万座ビーチのまわりの宿
 * 2日目（16:30 に出るのはもとのまま）: 宿 → 車28（22.9）→ 真栄田岬 岬の上 9:30 → 車21（15.2。もと10）→ 座喜味城跡 10:51（65→50）→ 車12（6.5。もと3）→
 *   やちむんの里 11:53〜13:08（昼食）→ 車17（11.6。もと9）→ 道の駅かでな 13:25（45→40）→ 車32（26.8。もと19）→ 嘉数高台公園 14:37（41→35）→ 車13（7.1。もと3）→
 *   浦添グスク・ようどれ館 15:25〜16:30（90→65）→ 車26（20.5）で那覇空港の近く、レンタカーを返す（15分）
 * 点: タイガービーチ＝OSM「富着ビーチ」（alt_name タイガービーチ）beach way 1499599325 の南西の端の node 1441865434（いまはバス停の点）／
 *   ムーンビーチ＝beach way 397191208 の node 2393785356・万座ビーチ＝beach way 232020569 の node 1441874999（いまはどちらも面の中心）／
 *   嘉数高台公園＝OSM「嘉数之塔」historic=memorial node 12624623915（いまは公園の面の中心。メモに慰霊碑）
 * 昼食: タイガービーチ前のバス停のまわりに OSM の食事処の点（恩納そば・あしびなー など）。やちむんの里のまわりに 森の茶屋・やちむんカフェ ぐんじょう・花浅葱 など
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-117-043809ae.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "043809ae-d0e4-45e2-9f22-c5ad931cbde0";
const DAY1_ID = "a979ea9b-c9e9-4c60-9415-074fe31b8842";
const DAY2_ID = "95868575-8fe1-4220-a6cf-360ce2d644a0";
const MAEDA = "d6bea67d-0d79-4c36-bc97-7ffc8f03c46c";
const TIGER = "1f97e175-9706-4520-b12b-f48e9c4c41d2";
const MOON = "cbdfa272-96eb-4994-8adf-7aebec5c792a";
const MANZA = "7689d93a-e964-452f-8275-1456a8369d60";
const MISAKI = "55206289-a6fa-4844-ba40-35ed243f253a";
const ZAKIMI = "f41d5f82-d6bc-46cb-b596-b134f9a6995a";
const YACHI = "7c30236f-e0c1-4c8d-84b6-9f596815c58c";
const KADENA = "832ed6c4-315b-4749-ac8e-5f8d884a0f8a";
const KAKAZU = "d44aa6e1-c7ff-4332-a415-5a3816725db4";
const URASOE = "21c0f53f-b5a8-4bbd-a463-cf9e8ad7ad80";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [TIGER]: { from: [26.453133, 127.80638], to: [26.454693, 127.806576] },
  [MOON]: { from: [26.450941, 127.802092], to: [26.450657, 127.802264] },
  [MANZA]: { from: [26.506212, 127.859164], to: [26.506489, 127.858993] },
  [KAKAZU]: { from: [26.258677, 127.736482], to: [26.258984, 127.736536] },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [MAEDA]: [
    { from: "那覇空港から車でおよそ1時間、", to: "那覇空港に10時半ごろ着いたら、空港の近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ59分、" },
    { from: "この後は、車でおよそ6分、", to: "この後は、車でおよそ16分、" },
  ],
  [TIGER]: [
    { from: "真栄田岬から車でおよそ6分、", to: "真栄田岬から車でおよそ16分、" },
    { from: "この後は、歩いておよそ8分、", to: "この後は、車でおよそ7分、" },
  ],
  [MOON]: [
    { from: "タイガービーチから歩いておよそ8分、", to: "タイガービーチから車でおよそ7分、" },
    { from: "この後は、車でおよそ16分、", to: "この後は、車でおよそ22分、" },
  ],
  [MANZA]: [
    { from: "ムーンビーチから車でおよそ16分、", to: "ムーンビーチから車でおよそ22分、" },
    { from: "見学を終えたら、今夜の宿へ向かいましょう。", to: "この夜は、万座ビーチのまわりの宿に泊まりましょう。" },
  ],
  [MISAKI]: [
    { from: "宿を出て、車でおよそ15分、", to: "万座ビーチのまわりの宿を出て、車でおよそ28分、" },
    { from: "この後は、車でおよそ10分、", to: "この後は、車でおよそ21分、" },
  ],
  [ZAKIMI]: [
    { from: "真栄田岬の岬の上から、車でおよそ10分、", to: "真栄田岬の岬の上から、車でおよそ21分、" },
    { from: "この後は、車でおよそ3分、", to: "この後は、車でおよそ12分、" },
  ],
  [YACHI]: [
    { from: "座喜味城跡から車でおよそ3分、", to: "座喜味城跡から車でおよそ12分、" },
    { from: "工房を一つずつのぞいてみましょう。", to: "工房を一つずつのぞきましょう。" },
    { from: "この後は、車でおよそ9分、", to: "この後は、車でおよそ17分、" },
  ],
  [KADENA]: [
    { from: "やちむんの里から車でおよそ9分、", to: "やちむんの里から車でおよそ17分、" },
    { from: "この後は、車でおよそ19分、", to: "この後は、車でおよそ32分、" },
  ],
  [KAKAZU]: [
    { from: "道の駅かでなから車でおよそ19分、", to: "道の駅かでなから車でおよそ32分、" },
    { from: "この後は、車でおよそ3分、", to: "この後は、車でおよそ13分、" },
    { from: "慰霊碑もあり、亡くなった方々をしのぶ場所でもあるので、静かに、敬意を持って見学しましょう。", to: "慰霊碑の嘉数之塔もあり、慰霊の場でもあるので、静かに、敬意をもって見学しましょう。" },
  ],
  [URASOE]: [
    { from: "嘉数高台公園から車でおよそ3分、", to: "嘉数高台公園から車でおよそ13分、" },
    { from: "外から眺めてみましょう。", to: "外から眺めましょう。陵墓のまわりでは、静かに過ごしましょう。" },
    { from: "石棺なども展示されています。静かに、敬意を持って見学しましょう。", to: "石棺なども展示されています。慰霊の場でもあるので、静かに、敬意をもって見学しましょう。" },
    {
      from: "見学を終えたら、車でおよそ20分、那覇市内か那覇空港でレンタカーを返し、帰りの飛行機に乗りましょう。",
      to: "見学を終えたら、車でおよそ26分の那覇空港の近くでレンタカーを返し（返す手続きに15分ほど）、帰りの飛行機に乗りましょう。",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: MAEDA, h: 11, m: 44, stay: 80, legs: [] },
  { id: TIGER, h: 13, m: 20, stay: 70, legs: [car(16)] },
  { id: MOON, h: 14, m: 37, stay: 50, legs: [car(7)] },
  { id: MANZA, h: 15, m: 49, stay: 60, legs: [car(22)] },
];
const DAY2: Plan = [
  { id: MISAKI, h: 9, m: 30, stay: 60, legs: [] },
  { id: ZAKIMI, h: 10, m: 51, stay: 50, legs: [car(21)] },
  { id: YACHI, h: 11, m: 53, stay: 75, legs: [car(12)] },
  { id: KADENA, h: 13, m: 25, stay: 40, legs: [car(17)] },
  { id: KAKAZU, h: 14, m: 37, stay: 35, legs: [car(32)] },
  { id: URASOE, h: 15, m: 25, stay: 65, legs: [car(13)] },
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
  for (const s of all) {
    const m = memos[s.id] ?? s.memo ?? "";
    for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "ホテル", "旅館"]) if (m.includes(w)) console.log(`  ⚠ ${s.name}: 「${w}」が残っています`);
  }
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const show = (label: string, plan: Plan) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = all.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分 ${s.transitLegs.map((l) => l.transitMode + l.transitDurationMin).join("+") || "-"}）${p.stay > (s.stayDurationMin ?? 0) ? " ⚠滞在がもとより長い" : ""}`);
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

/**
 * 初日・最終日の見直し #121 9dff2862「遠野物語の里をじっくり巡る、民話とオシラサマの1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 10時ごろ、#110〜#123 は制作補助2）
 * 車は OSRM、歩きは routed-foot（もとの値が ×1.5＋5 の内側ならそのまま、外れる区間・新しい区間は切り上げ＋5、歩きは切り上げ）
 * 1日目: 遠野駅 10:30ごろ → レンタカー（手続き15分）→ 車6（0.9）→ とおの物語の館 10:51（75→45）→ 歩5 → 遠野市立博物館 11:41（75→50）→ 歩5 → 鍋倉公園（南部神社）12:36（40→25）→
 *   歩5（306m）で物語の館の車＋車11（5.7。もと車20）→ 道の駅遠野風の丘 13:17〜14:07（昼食、60→50）→ 車20（13.9）→ 遠野馬の里 14:27（40→30）→ 車10（8.5）→
 *   遠野郷八幡宮 15:07（30→25）→ 車15（10.1）→ 五百羅漢 15:47（40→30）→ 車12（6.7。もと5）→ 卯子酉神社 16:29〜16:49（20）→ 車7（2.9）で遠野駅のまわりの宿
 * 2日目（16:55 に出るのはもとのまま）: 宿 → 車30 → 早池峯神社 9:00 → 車23（17.1。もと15）→ 遠野ふるさと村 10:03（105→90）→ 車15（6.9）→
 *   伝承園 11:48〜13:18（園内の「おしら亭」で昼食。観光マネジメントボード遠野 2026-07-10 https://prtimes.jp/main/html/rd/p/000000006.000144434.html
 *   「郷土料理を味わえる「おしら亭」も人気です。」）→ 歩8（531m・7.1。もと5）→ カッパ淵 13:26 → 歩8で伝承園の車＋車8（2.9。もと車10）→ 福泉寺 14:17 →
 *   車35（27.8）→ めがね橋 15:37 → 車30（21.3）→ 遠野蔵の道ギャラリー 16:32〜16:55（25→23）→ 車7（1.5）で遠野駅、レンタカーを返す（15分）
 * 点: 鍋倉公園＝OSM「南部神社」place_of_worship node 2985340551（いまは公園の面の中心。メモに南部神社）／めがね橋＝OSM「めがね橋」node 2600959402
 *   （いまは道の駅みやもりの駐車場の点）／蔵の道ギャラリー＝OSM「遠野蔵の道ギャラリー」gallery node 12095659378（いまは道の上の点）
 *   福泉寺は OSM にバス停だけ、地理院の住所検索も大字までのため、いまの点のまま（地理院地図の「福泉寺」の注記の位置。法務に相談）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-121-9dff2862.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "9dff2862-bb91-4d25-847e-62f2267f18de";
const DAY1_ID = "4081ec1a-9f1e-4d2f-9461-43d88b071b9c";
const DAY2_ID = "3e842819-542c-4d9a-94b9-821093a3f5f8";
const MONO = "14909a4b-4f62-4776-a4cf-5ef86dc8b6c3";
const HAKU = "fde97646-ffd1-4b42-bf4b-ef38d8d866e9";
const NABE = "622ef8d6-676b-431f-ae36-1453a80bf6c9";
const KAZE = "3f0ff0d8-63d0-47c4-9569-df52f2b58907";
const UMA = "b8413733-52d5-49c3-8fff-293b269f17fb";
const HACHI = "f4dc1fdc-29a9-4550-9e6c-6f182393863e";
const RAKAN = "8ffecaef-b1f5-4be6-858e-50f400173fb3";
const USHI = "f681181a-1440-4949-8288-d5c16be85bfe";
const HAYA = "c14f3a7a-3047-442e-ae54-231e6e902b80";
const FURU = "19b809ea-1aa3-473a-a368-1a00beae52fc";
const DEN = "d2c713ee-0e3e-4eb8-bbd2-acb07e26f950";
const KAPPA = "bf8d14e9-5afc-403d-a864-9876930a4b93";
const FUKU = "952cd74b-0f56-435b-86a8-1b8c6f915ca7";
const MEGANE = "648f914e-7144-408e-9a73-eab7c2520eb6";
const KURA = "73d0e539-5288-41e8-b68c-ed9224b3b635";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const car = (min: number) => ({ mode: "car" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [NABE]: { from: [39.327514, 141.527887], to: [39.327374, 141.527715] },
  [MEGANE]: { from: [39.346011, 141.351618], to: [39.347257, 141.349589] },
  [KURA]: { from: [39.331295, 141.528061], to: [39.330955, 141.52807] },
};

const PRAY_FROM = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [MONO]: [
    {
      from: "JR遠野駅の近くでレンタカーを借りて、市街地のとおの物語の館へ。",
      to: "JR遠野駅に10時半ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ6分、市街地のとおの物語の館へ。",
    },
  ],
  [HAKU]: [{ from: "物語の館から歩いてすぐ。", to: "物語の館から歩いて約5分。" }],
  [NABE]: [
    { from: "博物館のすぐ裏の鍋倉山へ、歩いて上がります。", to: "博物館から歩いて約5分、すぐ裏の鍋倉山へ上がります。" },
    { from: "南部神社があり、遠野の町並みを見渡せます。", to: `南部神社があり、遠野の町並みを見渡せます。${PRAY_TO}` },
  ],
  [KAZE]: [{ from: "鍋倉公園から車で約20分、市街地の西へ。", to: "鍋倉公園から歩いて約5分で物語の館のそばにとめた車に戻り、車で約11分、市街地の西へ。" }],
  [HACHI]: [{ from: PRAY_FROM, to: PRAY_TO }],
  [RAKAN]: [
    { from: "苔むした石に刻まれた羅漢の姿を、静かに見て歩きましょう。", to: "苔むした石に刻まれた羅漢の姿を見て歩きましょう。供養の場でもあるので、静かに、敬意をもって見学しましょう。" },
  ],
  [USHI]: [
    { from: "五百羅漢から車で約5分。", to: "五百羅漢から車で約12分。" },
    { from: PRAY_FROM, to: PRAY_TO },
    { from: "このあとは、車で市街地の宿へ向かいましょう。", to: "この夜は、車でおよそ7分の、遠野駅のまわりの宿に泊まりましょう。" },
  ],
  [HAYA]: [
    { from: "宿から車で北へ約30分、", to: "遠野駅のまわりの宿から車で北へ約30分、" },
    { from: PRAY_FROM, to: PRAY_TO },
  ],
  [FURU]: [{ from: "早池峯神社から車で約15分、南へ。", to: "早池峯神社から車で約23分、南へ。" }],
  [KAPPA]: [{ from: "伝承園から歩いて約5分。", to: "伝承園から歩いて約8分。" }],
  [FUKU]: [
    { from: "カッパ淵から車で約10分。", to: "カッパ淵から歩いて約8分で伝承園にとめた車に戻り、車で約8分。" },
    { from: PRAY_FROM, to: PRAY_TO },
  ],
  [KURA]: [
    {
      from: "見学のあとは、遠野駅の近くでレンタカーを返し、JRで帰りましょう。",
      to: "見学のあとは、車でおよそ7分の遠野駅の近くでレンタカーを返し（返す手続きに15分ほど）、JRで帰りましょう。",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: MONO, h: 10, m: 51, stay: 45, legs: [] },
  { id: HAKU, h: 11, m: 41, stay: 50, legs: [walk(5)] },
  { id: NABE, h: 12, m: 36, stay: 25, legs: [walk(5)] },
  { id: KAZE, h: 13, m: 17, stay: 50, legs: [walk(5), car(11)] },
  { id: UMA, h: 14, m: 27, stay: 30, legs: [car(20)] },
  { id: HACHI, h: 15, m: 7, stay: 25, legs: [car(10)] },
  { id: RAKAN, h: 15, m: 47, stay: 30, legs: [car(15)] },
  { id: USHI, h: 16, m: 29, stay: 20, legs: [car(12)] },
];
const DAY2: Plan = [
  { id: HAYA, h: 9, m: 0, stay: 40, legs: [] },
  { id: FURU, h: 10, m: 3, stay: 90, legs: [car(23)] },
  { id: DEN, h: 11, m: 48, stay: 90, legs: [car(15)] },
  { id: KAPPA, h: 13, m: 26, stay: 35, legs: [walk(8)] },
  { id: FUKU, h: 14, m: 17, stay: 45, legs: [walk(8), car(8)] },
  { id: MEGANE, h: 15, m: 37, stay: 25, legs: [car(35)] },
  { id: KURA, h: 16, m: 32, stay: 23, legs: [car(30)] },
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
    for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "すぐ。", "ホテル", "旅館"]) if (m.includes(w)) console.log(`  ⚠ ${s.name}: 「${w}」が残っています`);
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

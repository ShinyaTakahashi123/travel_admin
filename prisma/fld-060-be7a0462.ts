/**
 * 初日・最終日の見直し #60 be7a0462「金津創作の森、里山に広がるアートの森を巡る1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30、checklist 7行目）
 * 車の分数は OSRM（もとの値は ×1.5＋5 の内側ならそのまま。道のりより短いもの・新しい区間は切り上げ＋5）。歩きは routed-foot
 * 1日目: 芦原温泉駅 10:30ごろ → レンタカー（手続き15分）→ 車15（OSRM 7.3、もとのまま）→ 金津創作の森 11:00〜12:30（ガラス工房もここで見学）→
 *   車15 → あわら湯のまち広場 12:45〜13:45（昼食）→ 車15 → 北潟湖畔 14:00（50）→ 車20 → 越前松島水族館 15:10〜16:10（90→60。冬は16:30閉館・最終入館16:00、
 *   https://www.echizen-aquarium.com/information/hours.html ）→ 歩6（389m。もと5）→ 越前松島 16:16〜16:51（55→35）
 *   金津創作の森ガラス工房は、創作の森と同じ点・同じ敷地で、OSM・地理院に別の点がないため、スポットとしては外して創作の森のメモに入れる（写真なし）
 * 2日目（終わり 16:48 はもとのまま）: 宿 → 車23（OSRM 17.6、もとの15は道のりより短い）→ 吉崎御坊跡 9:20 → 歩8（588m。もと5）→ 蓮如上人記念館 10:18 →
 *   歩3（183m。もと5）→ 吉崎別院 11:01 → 車25 → 丸岡城 11:56 → 歩7（517m。もと3）→ 一筆啓上日本一短い手紙の館 13:03（昼食）→ 車20 →
 *   旧森田銀行本店 14:13 → 歩13（948m。もと10）→ みくに龍翔館 15:26〜16:48（90→82）→ 車19（OSRM 13.9）で芦原温泉駅、レンタカーを返す
 * 点: 金津創作の森＝地理院の番地「宮谷57番地」（公式 https://sosaku.jp/ の住所 宮谷57-2-19。いまは20haの敷地の way の中心）／
 *   北潟湖畔＝OSM viewpoint「北潟湖展望台」way 1265585523（いまは湖の中心）／越前松島＝地理院の地名「越前松島」（いまは岩の集まりの relation の中心）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-060-be7a0462.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "be7a0462";
const SOSAKU = "e500ce28-fc19-4460-bc96-f32ce1ba951c";
const GLASS = "5d4687fa-bd06-4b35-90d8-d43ef9da4fb5";
const YUNO = "829b3593-ff11-4902-9d4f-092ca23f6b42";
const KITA = "eef16fb5-21f4-42e8-937a-8fe8e63d95f1";
const AQUA = "49e8af87-6240-444a-8154-87aa1999e177";
const MATSU = "f498e334-2a8e-4200-a9ad-088b98dd1deb";
const GOBO = "38e6820f-9d5b-4ec8-b685-b62ee2d29488";
const REN = "036eb77a-501a-4c9d-8dad-895f7f4d5c72";
const BETSU = "f3a7f35c-bcca-4b8c-8737-8f3a199db3e8";
const MARU = "dcaa8cbc-e3bc-477b-a997-f50a46ccfe3e";
const TEGAMI = "ef6a0f48-d35d-431a-862e-646ab0f0f909";
const MORITA = "45bb68d5-de36-4450-8096-a5a5f88cb0c7";
const RYU = "a011ca90-f250-4e75-8241-fbbef2c8d2e3";
const DAY1_ID = "84b6cca8-c535-4e1e-8728-0438e0bf091f";
const DAY2_ID = "628fc042-b8da-4f30-a9ba-e1cf2af4f5f4";
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
  [SOSAKU]: { from: [36.230492, 136.261346], to: [36.232243, 136.261215] },
  [KITA]: { from: [36.272343, 136.240799], to: [36.268558, 136.228886] },
  [MATSU]: { from: [36.255307, 136.147024], to: [36.255019, 136.147068] },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [SOSAKU]: [
    { from: "JR芦原温泉駅の近くでレンタカーを借りて、車でおよそ15分、", to: "JR芦原温泉駅に10時半ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ15分、" },
    {
      from: "この後は、歩いておよそ8分、ガラス工房へ向かいましょう。",
      to: "敷地の中のガラス工房では、吹きガラスなどの作家の制作の様子を見学できます。炎を使った作業もあるので、見学の際は作家の指示に従い、距離を保ちましょう。この後は、車でおよそ15分、あわら湯のまち広場へ向かいましょう。",
    },
  ],
  [YUNO]: [{ from: "ガラス工房から車でおよそ15分、", to: "金津創作の森から車でおよそ15分、" }],
  [AQUA]: [{ from: "この後は、歩いておよそ5分、越前松島へ向かいましょう。", to: "この後は、歩いておよそ6分、越前松島へ向かいましょう。" }],
  [MATSU]: [
    { from: "越前松島水族館から歩いておよそ5分、", to: "越前松島水族館から歩いておよそ6分、" },
    { from: "今夜はこの近くの宿に泊まりましょう。", to: "この夜は、越前松島のまわりの宿に泊まりましょう。" },
  ],
  [GOBO]: [
    { from: "宿から車でおよそ15分、", to: "宿から車でおよそ23分、" },
    { from: "この後は、歩いておよそ5分、蓮如上人記念館へ向かいましょう。", to: "この後は、歩いておよそ8分、蓮如上人記念館へ向かいましょう。" },
  ],
  [REN]: [
    { from: "吉崎御坊跡から歩いておよそ5分、", to: "吉崎御坊跡から歩いておよそ8分、" },
    { from: "この後は、歩いておよそ5分、吉崎別院へ向かいましょう。", to: "この後は、歩いておよそ3分、吉崎別院へ向かいましょう。" },
  ],
  [BETSU]: [
    { from: "蓮如上人記念館から歩いておよそ5分、", to: "蓮如上人記念館から歩いておよそ3分、" },
    { from: "今も祈りの場として大切にされている建物です。静かに、敬意をもってお参りしましょう。", to: "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。" },
  ],
  [MARU]: [{ from: "この後は、歩いておよそ3分、一筆啓上日本一短い手紙の館へ向かいましょう。", to: "この後は、歩いておよそ7分、一筆啓上日本一短い手紙の館へ向かいましょう。" }],
  [TEGAMI]: [{ from: "丸岡城から歩いておよそ3分、", to: "丸岡城から歩いておよそ7分、" }],
  [MORITA]: [{ from: "この後は、歩いておよそ10分、みくに龍翔館へ向かいましょう。", to: "この後は、歩いておよそ13分、みくに龍翔館へ向かいましょう。" }],
  [RYU]: [
    { from: "旧森田銀行本店から歩いておよそ10分、", to: "旧森田銀行本店から歩いておよそ13分、" },
    {
      from: "レンタカーを返して、帰りの電車に乗りましょう。",
      to: "見学を終えたら、車でおよそ19分の芦原温泉駅の近くでレンタカーを返し(返す手続きに15分ほど)、帰りの電車に乗りましょう。",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: SOSAKU, h: 11, m: 0, stay: 90, legs: [] },
  { id: YUNO, h: 12, m: 45, stay: 60, legs: [car(15)] },
  { id: KITA, h: 14, m: 0, stay: 50, legs: [car(15)] },
  { id: AQUA, h: 15, m: 10, stay: 60, legs: [car(20)] },
  { id: MATSU, h: 16, m: 16, stay: 35, legs: [walk(6)] },
];
const DAY2: Plan = [
  { id: GOBO, h: 9, m: 20, stay: 50, legs: [] },
  { id: REN, h: 10, m: 18, stay: 40, legs: [walk(8)] },
  { id: BETSU, h: 11, m: 1, stay: 30, legs: [walk(3)] },
  { id: MARU, h: 11, m: 56, stay: 60, legs: [car(25)] },
  { id: TEGAMI, h: 13, m: 3, stay: 50, legs: [walk(7)] },
  { id: MORITA, h: 14, m: 13, stay: 60, legs: [car(20)] },
  { id: RYU, h: 15, m: 26, stay: 82, legs: [walk(13)] },
];

async function main() {
  const it = await prisma.itinerary.findFirstOrThrow({ where: { days: { some: { id: DAY1_ID } } }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  if (!it.id.startsWith(ITINERARY_ID)) throw new Error(`しおりが想定と違います: ${it.id}`);
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [SOSAKU, GLASS, YUNO, KITA, AQUA, MATSU].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [GOBO, REN, BETSU, MARU, TEGAMI, MORITA, RYU].join()) throw new Error("2日目の構成が想定と違います");
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
  for (const w of ["ください", "おすすめ", "よいでしょう", "ガラス工房から", "ホテル", "旅館"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」が残っています`));
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const show = (label: string, plan: Plan) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = all.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分 ${s.transitLegs.map((l) => l.transitMode + l.transitDurationMin).join("+") || "-"}）`);
      if (COORDS[p.id]) console.log(`  座標 ${COORDS[p.id].from.join(",")} → ${COORDS[p.id].to.join(",")}`);
      for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", DAY1);
  show("2日目（直したあと）", DAY2);
  console.log("\n外す: 金津創作の森ガラス工房（1日目、写真なし。創作の森のメモに入れる）");
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
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx, remove: [GLASS] });
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

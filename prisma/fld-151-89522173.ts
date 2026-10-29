/**
 * 初日・最終日の見直し #151 89522173「湯畑の湯けむりと雪見の露天風呂。冬の草津でゆったり湯めぐり」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日・冬。初日を11時ごろからにする。2日目は歩きの時間が道のりと合っていなかったので、内容の誤りとして直す（企画運営 10/30）
 * いまの初日（8か所）: 熱乃湯 9:30 → 御座之湯 → 湯畑 → 白旗の湯 → 光泉寺 → 草津熱帯圏（昼食）→ 片岡鶴太郎美術館 → 西の河原公園・露天風呂 14:57〜16:33
 * 直した初日（8か所のまま）: 草津温泉バスターミナルに11時ごろ → 歩いて約5分 → 湯畑 11:05 → 白旗の湯 → 光泉寺 → 草津熱帯圏（昼食 12:19〜）→ 御座之湯 → 美術館 →
 *   熱乃湯 15:30（湯もみショーの午後の回）→ 西の河原 16:00〜16:30
 *   どこも外さない。昼食を13:30までにし、湯もみショー（9:30・10:00・10:30・15:30・16:00・16:30）に合わせるため、熱乃湯を夕方にする
 *   歩き（道のり。routing.openstreetmap.de の foot）: BT→湯畑 353m・5分、湯畑→白旗 77m・1分、白旗→光泉寺 122m・2分、光泉寺→熱帯圏 852m・11分、
 *     熱帯圏→御座之湯 841m・11分、御座之湯→美術館 446m・6分、美術館→熱乃湯 460m・6分、熱乃湯→西の河原 760m・10分
 *   滞在はどれも、もとより短いか同じ（湯畑 40→30分、白旗 20→15分、光泉寺 20→15分、熱帯圏 75分、御座之湯 70→55分、美術館 40→38分、熱乃湯 20分、西の河原 96→30分）
 * 2日目（7か所のまま。終わりは16:33で今と同じ）: 図書館→地蔵の湯 405m・6分（15→6）、地蔵の湯→白根神社 419m・6分（8→6）、白根神社→道の駅 2,317m・31分（20→31）、
 *   道の駅→西の河原通り 2,163m・29分（15→29）。滞在で合わせる（白根神社 40→30分、道の駅 45→41分）。バスの区間は今のまま
 * 座標（itinerary-rules 7章）: 光泉寺 → OSM way 1311927446（約60m。いまの点は0.1秒の度分秒の形）／
 *   2日目 草津温泉スキー場 → いまの点は度分秒の形で、スキー場の way の中心からも約720m。路線バス（天狗山方面）で着く天狗山のふもとの node 1047428335「天狗山レストハウス」に
 *   ／2日目 温泉図書館 → node 1742251452（約22m）。ほかは OSM の点と同じ
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-151-89522173.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "89522173-3b95-4393-a808-5ed5d465d85b";
const DAY1_ID = "b8ace1c7-10fb-46de-8298-f17534c40933";
const DAY2_ID = "1e2aa334-49de-4b08-a434-db0cb8bdd463";
const NETSUNOYU = "11e4e564-9599-4f65-95d6-1e33d1ef9a38";
const GOZA = "6e559045-60ac-4619-aaf2-96568bdd2c2a";
const YUBATAKE = "9a52b5e9-9618-4060-8e8c-faff2e39cafa";
const SHIRAHATA = "5e1ac0c4-2732-4667-9ade-a154841a1159";
const KOSENJI = "a5520d47-d128-4803-a939-a1a1e7f94bb7";
const NETTAI = "28911749-1036-4360-89a4-4851331fb8e7";
const BIJUTSU = "8f9f40c0-252a-449d-aeb9-bb52bbac903a";
const SAINO = "7cdf1cd8-2c68-4567-b40a-009cef4ea0d5";
const OTAKI = "93071d8d-bf94-4875-ab0b-736b7c7718bd";
const SKI = "cd4b986c-6e08-4328-a4d1-2fd013807480";
const LIBRARY = "c0fd8388-cfa2-4df0-a27c-b598dbba9213";
const JIZO = "a0593364-d264-4081-8296-78cb66ed66e6";
const SHIRANE = "e2de01fe-ab49-4ab2-84dd-e5ceca0c6d71";
const MICHINOEKI = "063f227b-8553-4f7b-8343-464fddea22cc";
const SAINO_DORI = "c0ceb352-1604-46fc-808f-e12ce6f45616";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const bus = (min: number, line: string) => ({ mode: "bus" as const, min, line });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  // 湯もみショーは 9:30・10:00・10:30・15:30・16:00・16:30（gltjp.com/ja/directory/item/12664/）。11時台にはないので、午後の15:30の回に合わせて夕方に入れる
  [NETSUNOYU]: [
    {
      from: "草津温泉のシンボル・湯畑のほど近くに立つ熱乃湯では、",
      to: "片岡鶴太郎美術館からは歩いておよそ6分です。草津温泉のシンボル・湯畑のほど近くに立つ熱乃湯では、",
    },
    { from: "上演されています。", to: "上演されています。この旅では、午後の回に合わせて入ります。ショーの時刻は、公式の案内で確かめましょう。" },
    { from: "続いては、歩いておよそ2分の御座之湯へ向かいましょう。", to: "続いては、歩いておよそ10分の西の河原公園・露天風呂へ向かいましょう。" },
  ],
  [YUBATAKE]: [
    { from: "御座之湯からは歩いておよそ2分です。", to: "この旅は歩きと路線バスでめぐります。草津温泉バスターミナルに11時ごろ着いたら、歩いておよそ5分です。" },
  ],
  [KOSENJI]: [
    { from: "白旗の湯からは歩いておよそ3分です。", to: "白旗の湯からは歩いておよそ2分です。" },
    { from: "続いては、歩いておよそ10分の草津熱帯圏へ向かいましょう。", to: "続いては、歩いておよそ11分の草津熱帯圏へ向かいましょう。" },
  ],
  [SHIRAHATA]: [{ from: "続いては、歩いておよそ3分の光泉寺へ向かいましょう。", to: "続いては、歩いておよそ2分の光泉寺へ向かいましょう。" }],
  [NETTAI]: [
    { from: "光泉寺からは歩いておよそ10分です(湯畑からの所要時間を基にした目安です)。", to: "光泉寺からは歩いておよそ11分です。" },
    { from: "続いては、歩いておよそ19分の草津片岡鶴太郎美術館へ向かいましょう。", to: "続いては、歩いておよそ11分の御座之湯へ向かいましょう。" },
  ],
  [GOZA]: [
    { from: "熱乃湯からは歩いておよそ2分です。", to: "草津熱帯圏からは歩いておよそ11分です。" },
    { from: "続いては、歩いておよそ2分の湯畑へ向かいましょう。", to: "続いては、歩いておよそ6分の草津片岡鶴太郎美術館へ向かいましょう。" },
  ],
  [BIJUTSU]: [
    { from: "草津熱帯圏からは歩いておよそ19分です。", to: "御座之湯からは歩いておよそ6分です。" },
    { from: "続いては、歩いてすぐの西の河原公園・露天風呂へ向かいましょう。", to: "続いては、歩いておよそ6分の熱乃湯へ向かいましょう。" },
  ],
  [SAINO]: [{ from: "片岡鶴太郎美術館からは歩いてすぐです。", to: "熱乃湯からは歩いておよそ10分です。" }],
  // 2日目
  [LIBRARY]: [{ from: "続いては、歩いておよそ15分の地蔵の湯へ向かいましょう。", to: "続いては、歩いておよそ6分の地蔵の湯へ向かいましょう。" }],
  [JIZO]: [
    { from: "温泉図書館からは歩いておよそ15分です(坂の上り下りがあるため、直線距離より時間がかかります)。", to: "温泉図書館からは歩いておよそ6分です。" },
    { from: "続いては、歩いておよそ8分の白根神社へ向かいましょう。", to: "続いては、歩いておよそ6分の白根神社へ向かいましょう。" },
  ],
  [SHIRANE]: [
    { from: "地蔵の湯からは歩いておよそ8分です。", to: "地蔵の湯からは歩いておよそ6分です。" },
    { from: "続いては、歩いておよそ20分の道の駅 草津運動茶屋公園へ向かいましょう。", to: "続いては、歩いておよそ31分の道の駅 草津運動茶屋公園へ向かいましょう。" },
  ],
  [MICHINOEKI]: [
    { from: "白根神社からは歩いておよそ20分です。", to: "白根神社からは歩いておよそ31分です。" },
    { from: "続いては、歩いておよそ15分の西の河原通りへ向かいましょう。", to: "続いては、歩いておよそ29分の西の河原通りへ向かいましょう。" },
  ],
  [SAINO_DORI]: [{ from: "道の駅からは歩いておよそ15分です。", to: "道の駅からは歩いておよそ29分です。" }],
};

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: KOSENJI, from: [36.622278, 138.595056], to: [36.621787, 138.595298] },
  { id: SKI, from: [36.629167, 138.585833], to: [36.628185, 138.587196] },
  { id: LIBRARY, from: [36.620524, 138.596367], to: [36.620695, 138.596497] },
];

const DAY1_PLAN: Plan = [
  { id: YUBATAKE, h: 11, m: 5, stay: 30, legs: [] },
  { id: SHIRAHATA, h: 11, m: 36, stay: 15, legs: [walk(1)] },
  { id: KOSENJI, h: 11, m: 53, stay: 15, legs: [walk(2)] },
  { id: NETTAI, h: 12, m: 19, stay: 75, legs: [walk(11)] },
  { id: GOZA, h: 13, m: 45, stay: 55, legs: [walk(11)] },
  { id: BIJUTSU, h: 14, m: 46, stay: 38, legs: [walk(6)] },
  { id: NETSUNOYU, h: 15, m: 30, stay: 20, legs: [walk(6)] },
  { id: SAINO, h: 16, m: 0, stay: 30, legs: [walk(10)] },
];
const DAY2_PLAN: Plan = [
  { id: OTAKI, h: 9, m: 30, stay: 70, legs: [] },
  { id: SKI, h: 10, m: 55, stay: 40, legs: [bus(15, "路線バス（天狗山方面）")] },
  { id: LIBRARY, h: 11, m: 50, stay: 35, legs: [bus(15, "路線バス（天狗山方面）")] },
  { id: JIZO, h: 12, m: 31, stay: 70, legs: [walk(6)] },
  { id: SHIRANE, h: 13, m: 47, stay: 30, legs: [walk(6)] },
  { id: MICHINOEKI, h: 14, m: 48, stay: 41, legs: [walk(31)] },
  { id: SAINO_DORI, h: 15, m: 58, stay: 35, legs: [walk(29)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [NETSUNOYU, GOZA, YUBATAKE, SHIRAHATA, KOSENJI, NETTAI, BIJUTSU, SAINO].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2_PLAN.map((p) => p.id).join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  const memoOf = (id: string) => {
    let m = all.find((s) => s.id === id)!.memo ?? "";
    for (const e of MEMO_EDITS[id] ?? []) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const build = (plan: Plan) => plan.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: memoOf(p.id) } : {}) } }));
  const days: [string, Plan][] = [
    ["1日目", DAY1_PLAN],
    ["2日目", DAY2_PLAN],
  ];
  for (const [label, plan] of days) {
    console.log(`\n${label}（直したあと）`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = all.find((x) => x.id === p.id)!;
      console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分）${MEMO_EDITS[p.id] ? "\n  本文: " + memoOf(p.id) : "（本文は変えない）"}`);
      prevEnd = st + p.stay;
    }
  }
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`\n座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, build(DAY1_PLAN) as never, { tx });
      await setDaySpotOrder(DAY2_ID, build(DAY2_PLAN) as never, { tx });
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

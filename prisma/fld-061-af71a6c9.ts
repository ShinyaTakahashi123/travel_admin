/**
 * 初日・最終日の見直し #61 af71a6c9「21世紀美術館とにし茶屋街、モダンとレトロの金沢1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30、checklist 7行目）
 * 歩きは routed-foot（全区間を測り直し）
 * 1日目: 金沢駅 10:30ごろ → 歩33（2,426m。もとは入口の一文なし）→ 石川四高記念文化交流館 11:03 → 歩6 → 金沢21世紀美術館 11:54〜13:19（100→85。
 *   昼食は館内のカフェレストラン、公式 https://www.kanazawa21.jp/data_list.php?g=10&d=2 「ビュッフェ式のランチ」。もとは県立美術館で昼食だったが、
 *   県立美術館のカフェ https://www.ishibi.pref.ishikawa.jp/guide/cafe/ はスイーツが中心）→ 歩7 → 石川県立美術館 13:26〜14:26 → 歩3 → 国立工芸館 14:29 → 歩2 → いしかわ赤レンガミュージアム 15:21（55→45）→ 歩8 →
 *   鈴木大拙館 16:14〜16:55（50→41）→ 歩15 で香林坊・片町のまわりの宿
 * 2日目（もとは昼食がなく、終わり 15:47 で 16:30 に届かない。昼食の場所を足して 16:51 に。決まり369の③）:
 *   宿 → 歩15（1,098m）→ にし茶屋街 9:30 → 歩6 → 妙立寺 10:46 → 歩4 → 松月寺 12:00 → 歩8 → 犀川大橋 12:38 → 歩14 →
 *   【新】香林坊のまわり 13:17〜14:07（昼食）→ 歩7 → 尾山神社 14:14 → 歩20（1,475m。もと15）→ 主計町茶屋街 15:09 → 歩7（もと5）→
 *   ひがし茶屋街 15:51〜16:51 → 歩30（2,219m）で金沢駅
 * 点: 犀川大橋＝橋の way 919604856 の node 2075989812（いまは橋の面の中心で、歩きの道のりが川べりの道にずれる）／
 *   香林坊のまわり＝OSM バス停「香林坊」node 4704469890（店ではない名前の点）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-061-af71a6c9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "af71a6c9-a140-4f38-8734-69ec95dbed64";
const DAY1_ID = "381fd70e-e897-4a34-9f11-e4e4103ed907";
const DAY2_ID = "7ad2e433-7cab-4926-9eb1-a6edbc811ff9";
const SHIKO = "dd1d49a8-48d5-4440-adf8-0d03f704daa2";
const NIJU = "2856b7de-6116-41ad-bc01-585195d0f192";
const KENBI = "7bb248c2-4195-4c84-8067-e045bdc0f0db";
const KOGEI = "229402d9-2698-4368-89fd-cd5435d4b269";
const AKA = "feb203c0-762a-4f41-bb1d-8fe492b6557b";
const DAISETSU = "f200aaae-15fd-4881-896a-bc194f47631d";
const NISHI = "89969b3c-c8da-42b0-a6a0-d55c310e74ba";
const MYORYU = "e9c99d8b-616d-4f22-b80f-e7d9a582a5f9";
const SHOGETSU = "24e1e435-0202-408f-9460-e221d4bf1054";
const SAI = "903b886d-5b57-42a8-b197-6b9571851005";
const OYAMA = "4ced2cb6-fd12-4a66-a394-0a724af4a46a";
const KAZUE = "0e684aec-98ac-401b-a50d-42f77e2f9a26";
const HIGASHI = "098e20c8-bf54-4ae6-a575-739afde98927";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [SAI]: { from: [36.558475, 136.650408], to: [36.558295, 136.650141] },
};

const PRAY_FROM = "参拝の際は、敬意を持ってお参りしましょう。";
const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const LUNCH = "new-korinbo";
const LUNCH_SPOT = {
  name: "香林坊のまわり",
  lat: 36.563334,
  lng: 136.653568,
  memo: "犀川大橋から歩いておよそ14分、金沢の中心街・香林坊のまわりに着きます。飲食店の多いあたりなので、ここで昼食をとりましょう。食事を終えたら、歩いておよそ7分、尾山神社へ向かいましょう。",
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [SHIKO]: [
    { from: "旅の始まりは石川四高記念文化交流館です。", to: "JR金沢駅に10時半ごろ着いたら、歩いておよそ33分の石川四高記念文化交流館から旅を始めます。" },
    { from: "この後は、歩いておよそ5分、金沢21世紀美術館へ向かいましょう。", to: "この後は、歩いておよそ6分、金沢21世紀美術館へ向かいましょう。" },
  ],
  [NIJU]: [
    { from: "四高記念文化交流館から歩いておよそ5分、", to: "四高記念文化交流館から歩いておよそ6分、" },
    { from: "この後は、歩いておよそ5分、石川県立美術館へ向かいましょう。", to: "館内のカフェレストランで、昼食をとりましょう。この後は、歩いておよそ7分、石川県立美術館へ向かいましょう。" },
  ],
  [KENBI]: [
    { from: "金沢21世紀美術館から歩いておよそ5分、", to: "金沢21世紀美術館から歩いておよそ7分、" },
    { from: "ここで昼食にするのもおすすめです。この後は、歩いておよそ5分、国立工芸館へ向かいましょう。", to: "この後は、歩いておよそ3分、国立工芸館へ向かいましょう。" },
  ],
  [KOGEI]: [
    { from: "石川県立美術館から歩いておよそ5分、", to: "石川県立美術館から歩いておよそ3分、" },
    { from: "この後は、歩いておよそ5分、いしかわ赤レンガミュージアムへ向かいましょう。", to: "この後は、歩いておよそ2分、いしかわ赤レンガミュージアムへ向かいましょう。" },
  ],
  [AKA]: [
    { from: "国立工芸館から歩いておよそ5分、", to: "国立工芸館から歩いておよそ2分、" },
    { from: "この後は、歩いておよそ5分、鈴木大拙館へ向かいましょう。", to: "この後は、歩いておよそ8分、鈴木大拙館へ向かいましょう。" },
  ],
  [DAISETSU]: [
    { from: "いしかわ赤レンガミュージアムから歩いておよそ5分、", to: "いしかわ赤レンガミュージアムから歩いておよそ8分、" },
    { from: "静謐なひとときを過ごしてみてください。", to: "静謐なひとときを過ごしましょう。" },
    { from: "金沢の新しい建築と美術をめぐった1日目は、ここで終わりです。", to: "金沢の新しい建築と美術をめぐった1日目は、ここで終わりです。この夜は、歩いておよそ15分の香林坊・片町のまわりの宿に泊まりましょう。" },
  ],
  [NISHI]: [
    { from: "旅の2日目は、にし茶屋街からです。", to: "香林坊・片町のまわりの宿から歩いておよそ15分、旅の2日目は、にし茶屋街からです。" },
    { from: "金沢の花街文化を感じてみてください。この後は、歩いておよそ5分、妙立寺へ向かいましょう。", to: "金沢の花街文化を感じましょう。この後は、歩いておよそ6分、妙立寺へ向かいましょう。" },
  ],
  [MYORYU]: [
    { from: "にし茶屋街から歩いておよそ5分、", to: "にし茶屋街から歩いておよそ6分、" },
    { from: PRAY_FROM, to: PRAY_TO },
    { from: "この後は、歩いておよそ5分、松月寺へ向かいましょう。", to: "この後は、歩いておよそ4分、松月寺へ向かいましょう。" },
  ],
  [SHOGETSU]: [
    { from: "妙立寺から歩いておよそ5分、", to: "妙立寺から歩いておよそ4分、" },
    { from: PRAY_FROM, to: PRAY_TO },
    { from: "この後は、歩いておよそ7分、犀川大橋へ向かいましょう。", to: "この後は、歩いておよそ8分、犀川大橋へ向かいましょう。" },
  ],
  [SAI]: [
    { from: "松月寺から歩いておよそ7分、", to: "松月寺から歩いておよそ8分、" },
    { from: "この後は、歩いておよそ15分、尾山神社へ向かいましょう。", to: "この後は、歩いておよそ14分、香林坊のまわりへ向かいましょう。" },
  ],
  [OYAMA]: [
    { from: "犀川大橋から歩いておよそ15分、", to: "香林坊のまわりから歩いておよそ7分、" },
    { from: PRAY_FROM, to: PRAY_TO },
    { from: "この後は、歩いておよそ15分、主計町茶屋街へ向かいましょう。", to: "この後は、歩いておよそ20分、主計町茶屋街へ向かいましょう。" },
  ],
  [KAZUE]: [
    { from: "尾山神社から歩いておよそ15分、", to: "尾山神社から歩いておよそ20分、" },
    { from: "この後は、歩いておよそ5分、ひがし茶屋街へ向かいましょう。", to: "この後は、歩いておよそ7分、ひがし茶屋街へ向かいましょう。" },
  ],
  [HIGASHI]: [
    { from: "主計町茶屋街から歩いておよそ5分、", to: "主計町茶屋街から歩いておよそ7分、" },
    { from: "モダンとレトロの金沢の旅も、ここで終わりです。", to: "モダンとレトロの金沢の旅も、ここで終わりです。見学を終えたら、歩いておよそ30分の金沢駅から帰りましょう。" },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: SHIKO, h: 11, m: 3, stay: 45, legs: [] },
  { id: NIJU, h: 11, m: 54, stay: 85, legs: [walk(6)] },
  { id: KENBI, h: 13, m: 26, stay: 60, legs: [walk(7)] },
  { id: KOGEI, h: 14, m: 29, stay: 50, legs: [walk(3)] },
  { id: AKA, h: 15, m: 21, stay: 45, legs: [walk(2)] },
  { id: DAISETSU, h: 16, m: 14, stay: 41, legs: [walk(8)] },
];
const DAY2: Plan = [
  { id: NISHI, h: 9, m: 30, stay: 70, legs: [] },
  { id: MYORYU, h: 10, m: 46, stay: 70, legs: [walk(6)] },
  { id: SHOGETSU, h: 12, m: 0, stay: 30, legs: [walk(4)] },
  { id: SAI, h: 12, m: 38, stay: 25, legs: [walk(8)] },
  { id: LUNCH, h: 13, m: 17, stay: 50, legs: [walk(14)] },
  { id: OYAMA, h: 14, m: 14, stay: 35, legs: [walk(7)] },
  { id: KAZUE, h: 15, m: 9, stay: 35, legs: [walk(20)] },
  { id: HIGASHI, h: 15, m: 51, stay: 60, legs: [walk(7)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [SHIKO, NIJU, KENBI, KOGEI, AKA, DAISETSU].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [NISHI, MYORYU, SHOGETSU, SAI, OYAMA, KAZUE, HIGASHI].join()) throw new Error("2日目の構成が想定と違います");
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
  all.push({ ...LUNCH_SPOT, id: LUNCH, visitTime: null, stayDurationMin: null, transitLegs: [] } as never);
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "敬意を持って", "ホテル", "旅館", "んです"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」が残っています`));
  console.log(`新しい昼食の場所: ${LUNCH_SPOT.name}（${LUNCH_SPOT.lat},${LUNCH_SPOT.lng}）\n  ${LUNCH_SPOT.memo}`);
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
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = (plan: Plan) =>
    plan.map((p) =>
      p.id === LUNCH
        ? {
            create: {
              name: LUNCH_SPOT.name,
              visitTime: t(p.h, p.m),
              stayDurationMin: p.stay,
              transitLegs: { create: legsCreate(p.legs) },
              lat: LUNCH_SPOT.lat,
              lng: LUNCH_SPOT.lng,
              address: "石川県金沢市香林坊",
              memo: LUNCH_SPOT.memo,
            },
          }
        : {
            id: p.id,
            data: {
              ...timeLegs(p.h, p.m, p.stay, p.legs),
              ...(memos[p.id] !== undefined ? { memo: memos[p.id] } : {}),
              ...(COORDS[p.id] ? { lat: COORDS[p.id].to[0], lng: COORDS[p.id].to[1] } : {}),
            },
          }
    );
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

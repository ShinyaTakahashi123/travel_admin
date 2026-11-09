/**
 * 初日・最終日の見直し #145 9f58d4de「天満宮と九州国立博物館、太宰府の歴史と文化を巡る旅」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする。2日目は移動の時間が道のりと合っていなかったので、企画運営の指示（10/30「内容の誤りとして直す」）で直す
 * 座標: 低いけたの点が多く、OSM の点から84m〜920m 離れていたので、先に OSM の名前つきの地物に直し、その点で道のり（routing.openstreetmap.de の foot）を測った
 *   九州国立博物館 → way 134721523／天開稲荷社 → way 89457666／太宰府天満宮 → relation 7396059「本殿」／参道 → way 45775591／宝物殿 → way 45775588／
 *   光明禅寺 → way 1152781539（約500m）／水城跡 → node 4971477663「史蹟 水城阯」の碑（いまの点は碑と水城館のそば）／観世音寺 → way 104986678／戒壇院 → way 103651040／
 *   客館跡 → way 1151075349／大宰府政庁跡 → way 1153423229「正殿跡」（公園の中心は使わない）／竈門神社 → way 1180032939。菅公歴史館・榎社・展示館・坂本八幡宮・国分寺跡は OSM と同じ
 * 1日目（8か所 → 7か所）: 西鉄太宰府駅に11時ごろ → 参道を歩いて約10分 → 太宰府天満宮 11:10 → 宝物殿 → 菅公歴史館 → 参道（昼食 13:04〜）→ 光明禅寺 → 九州国立博物館 → 天開稲荷社 15:56〜16:30
 *   昼食を13:30までにし、閉まる時刻（九州国立博物館 入館16:30まで）に合わせるため、天満宮から始めて九博・天開稲荷社をあとにする
 *   太宰府市文化ふれあい館を外す（光明禅寺からバスで着くのが閉館間ぎわになる。タイトル・説明文に出てこない。写真なし）。宿の一文を天開稲荷社へ
 *   歩き: 駅→本殿 715m・約10分、本殿→宝物殿 532m・7分、宝物殿→菅公 496m・7分、菅公→参道 356m・5分、参道→光明禅寺 240m・3分、光明禅寺→九博 558m・7分、九博→天開 930m・12分
 *   滞在はどれも、もとより短い（天満宮 84→45分、宝物殿 35→25分、菅公 35→25分、参道 67→60分、光明禅寺 38→30分、九博 68→60分、天開 50→34分）
 * 2日目（10か所のまま。終わりは16:52で今より遅くならない）: 移動を道のりに直す
 *   水城→観世音寺 2,765m・37分（27→37）、観世音寺→戒壇院 139m・2分（5→2）、戒壇院→客館跡 1,420m・24分（19→24）、客館跡→榎社 434m・6分（5→6）、
 *   榎社→政庁跡 1,315m・18分（15→18）、政庁跡→展示館 253m・4分（7→4）、展示館→坂本八幡宮 593m・8分（5→8）、坂本八幡宮→国分寺跡 1,092m・15分（8→15）、
 *   国分寺跡→竈門神社: もとの「バスでおよそ15分」は、道のり6.2km（OSRM）で太宰府駅での乗りかえもあり合わない。タクシーで約15分にする（#137 と同じ）
 *   滞在を短くして合わせた（水城 50→40分、観世音寺 41→35分、政庁跡 60→55分、坂本八幡宮 18→15分。ほかはもとのまま）
 * 文: 前後のつなぎの文の分数を道のりに合わせる。「ください」は祈りの一文だけで、もとのまま
 * 説明文・タイトル・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-145-9f58d4de.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "9f58d4de-de1f-4ee2-9719-0aeadfc7fd0f";
const DAY1_ID = "8131749f-57e6-4cdf-a2ba-3d0eb2f9928c";
const DAY2_ID = "710a12c3-f43f-4f31-953c-31bcf19bc319";
const KYUHAKU = "4a7689e5-bdf2-486b-88a0-c28b3db3c86b";
const TENKAI = "97be37e3-b81c-4db3-bc08-5aaeb859a511";
const TENMANGU = "1fcd6d7a-aeb7-4e8e-8dde-8e41b7cb324c";
const SANDO = "f5c797ff-33c3-4094-97b8-64e6d82316ac";
const HOMOTSU = "ab45a3c4-db59-46f5-ab78-0118d8fb2ff1";
const KANKO = "bcd7d5c7-8c26-41ed-a9bc-8b51a613405c";
const KOMYO = "a02f8e90-50c8-4956-8f53-18bbdcba5669";
const FUREAI = "f8249575-4248-4e55-a521-3fa695dfee50";
const MIZUKI = "b240e472-335f-4e4a-9faa-49722171b1c3";
const KANZEON = "80123548-0cf8-4b65-a544-5e9ec54201c5";
const KAIDAN = "5798c434-89c1-4f2c-8f0e-27776529ba65";
const KYAKKAN = "0b0e5580-d3f6-4df6-b7d8-3b14f1c51ed9";
const ENOKI = "1db5c0cd-1c60-4f16-8d0f-e973c09eab53";
const SEICHO = "b03fa3ca-17d0-4b64-9370-1bedb22d54d9";
const TENJIKAN = "9bbb91b4-9494-438c-af41-3c063b84fef9";
const SAKAMOTO = "32cc9e46-a255-475d-a07b-827c9b01ffa2";
const KOKUBUNJI = "90ebb499-fe73-49a2-913f-22be8dfdaad6";
const KAMADO = "a7ff43ac-f151-4257-adc6-323e56e9698f";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const taxi = (min: number) => ({ mode: "taxi" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  // 1日目
  [TENMANGU]: [
    { from: "天開稲荷社からは歩いておよそ5分です。", to: "この旅は電車と歩き（一部タクシー）でめぐります。西鉄太宰府駅に11時ごろ着いたら、参道を通って歩いておよそ10分です。" },
    { from: "続いては、歩いておよそ5分の太宰府天満宮参道へ向かいましょう。", to: "続いては、歩いておよそ7分の太宰府天満宮宝物殿へ向かいましょう。" },
  ],
  [HOMOTSU]: [
    { from: "太宰府天満宮参道からは歩いておよそ5分です。", to: "太宰府天満宮の本殿からは歩いておよそ7分です。" },
    { from: "続いては、歩いておよそ3分の菅公歴史館へ向かいましょう。", to: "続いては、歩いておよそ7分の菅公歴史館へ向かいましょう。" },
  ],
  [KANKO]: [
    { from: "太宰府天満宮宝物殿からは歩いておよそ3分です。", to: "太宰府天満宮宝物殿からは歩いておよそ7分です。" },
    { from: "続いては、歩いておよそ5分の光明禅寺へ向かいましょう。", to: "続いては、歩いておよそ5分の太宰府天満宮参道へ向かいましょう。" },
  ],
  [SANDO]: [
    { from: "太宰府天満宮からは歩いておよそ5分です。", to: "菅公歴史館からは歩いておよそ5分です。" },
    { from: "続いては、歩いておよそ5分の太宰府天満宮宝物殿へ向かいましょう。", to: "続いては、歩いておよそ3分の光明禅寺へ向かいましょう。" },
    // 法務 10/30: すすめる言い方を避ける
    { from: "このあたりの飲食店で昼食をとるとよいでしょう。", to: "このあたりの飲食店で昼食にしましょう。" },
  ],
  [KOMYO]: [
    { from: "菅公歴史館からは歩いておよそ5分です。", to: "太宰府天満宮参道からは歩いておよそ3分です。" },
    { from: "続いては、バスでおよそ15分の太宰府市文化ふれあい館へ向かいましょう。", to: "続いては、歩いておよそ7分の九州国立博物館へ向かいましょう。" },
  ],
  [KYUHAKU]: [
    { from: "九州国立博物館は、東京・京都・奈良に次ぐ、", to: "光明禅寺からは歩いておよそ7分です。九州国立博物館は、東京・京都・奈良に次ぐ、" },
    { from: "続いては、歩いておよそ5分の天開稲荷社へ向かいましょう。", to: "続いては、歩いておよそ12分の天開稲荷社へ向かいましょう。" },
  ],
  [TENKAI]: [
    { from: "九州国立博物館からは歩いておよそ5分です。", to: "九州国立博物館からは歩いておよそ12分です。" },
    { from: "続いては、歩いておよそ5分の太宰府天満宮へ向かいましょう。", to: "この夜は、太宰府の宿に泊まりましょう。" },
  ],
  // 2日目
  [MIZUKI]: [{ from: "続いては、歩いておよそ27分の観世音寺へ向かいましょう。", to: "続いては、歩いておよそ37分の観世音寺へ向かいましょう。" }],
  [KANZEON]: [
    { from: "水城跡からは歩いておよそ27分です。", to: "水城跡からは歩いておよそ37分です。" },
    { from: "続いては、歩いておよそ5分の戒壇院へ向かいましょう。", to: "続いては、歩いておよそ2分の戒壇院へ向かいましょう。" },
  ],
  [KAIDAN]: [
    { from: "観世音寺からは歩いておよそ5分です。", to: "観世音寺からは歩いておよそ2分です。" },
    { from: "続いては、歩いておよそ19分の客館跡へ向かいましょう。", to: "続いては、歩いておよそ24分の客館跡へ向かいましょう。" },
  ],
  [KYAKKAN]: [
    { from: "戒壇院からは歩いておよそ19分です。", to: "戒壇院からは歩いておよそ24分です。" },
    { from: "続いては、歩いておよそ5分の榎社へ向かいましょう。", to: "続いては、歩いておよそ6分の榎社へ向かいましょう。" },
  ],
  [ENOKI]: [
    { from: "客館跡からは歩いておよそ5分です。", to: "客館跡からは歩いておよそ6分です。" },
    { from: "続いては、歩いておよそ15分の大宰府政庁跡へ向かいましょう。", to: "続いては、歩いておよそ18分の大宰府政庁跡へ向かいましょう。" },
  ],
  [SEICHO]: [
    { from: "榎社からは歩いておよそ15分です。", to: "榎社からは歩いておよそ18分です。" },
    { from: "続いては、歩いておよそ7分の大宰府展示館へ向かいましょう。", to: "続いては、歩いておよそ4分の大宰府展示館へ向かいましょう。" },
  ],
  [TENJIKAN]: [
    { from: "大宰府政庁跡からは歩いておよそ7分です。", to: "大宰府政庁跡からは歩いておよそ4分です。" },
    { from: "続いては、歩いておよそ5分の坂本八幡宮へ向かいましょう。", to: "続いては、歩いておよそ8分の坂本八幡宮へ向かいましょう。" },
  ],
  [SAKAMOTO]: [
    { from: "大宰府展示館からは歩いておよそ5分です。", to: "大宰府展示館からは歩いておよそ8分です。" },
    { from: "続いては、歩いておよそ8分の筑前国分寺跡へ向かいましょう。", to: "続いては、歩いておよそ15分の筑前国分寺跡へ向かいましょう。" },
  ],
  [KOKUBUNJI]: [
    { from: "坂本八幡宮からは歩いておよそ8分です。", to: "坂本八幡宮からは歩いておよそ15分です。" },
    { from: "続いては、バスでおよそ15分の竈門神社へ向かいましょう。", to: "続いては、タクシーでおよそ15分の竈門神社へ向かいましょう。" },
  ],
  [KAMADO]: [{ from: "筑前国分寺跡からは、バスでおよそ15分です。", to: "筑前国分寺跡からは、タクシーでおよそ15分です。タクシーは、前もって呼んでおきましょう。" }],
};

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: KYUHAKU, from: [33.5203, 130.5378], to: [33.518219, 130.538463] },
  { id: TENKAI, from: [33.5236, 130.5358], to: [33.522965, 130.53788] },
  { id: TENMANGU, from: [33.5219, 130.5347], to: [33.521281, 130.535042] },
  { id: SANDO, from: [33.5206, 130.5333], to: [33.519539, 130.533487] },
  { id: HOMOTSU, from: [33.5219, 130.5347], to: [33.520754, 130.535354] },
  { id: KOMYO, from: [33.5222, 130.5314], to: [33.518291, 130.533759] },
  { id: MIZUKI, from: [33.521808, 130.498937], to: [33.522011, 130.49865] },
  { id: KANZEON, from: [33.5192, 130.5219], to: [33.514562, 130.521631] },
  { id: KAIDAN, from: [33.5183, 130.5211], to: [33.514874, 130.520857] },
  { id: KYAKKAN, from: [33.505253, 130.516983], to: [33.504991, 130.516545] },
  { id: SEICHO, from: [33.5175, 130.5203], to: [33.515108, 130.515175] },
  { id: KAMADO, from: [33.528861, 130.552389], to: [33.52883, 130.552445] },
];

const DAY1_PLAN: Plan = [
  { id: TENMANGU, h: 11, m: 10, stay: 45, legs: [] },
  { id: HOMOTSU, h: 12, m: 2, stay: 25, legs: [walk(7)] },
  { id: KANKO, h: 12, m: 34, stay: 25, legs: [walk(7)] },
  { id: SANDO, h: 13, m: 4, stay: 60, legs: [walk(5)] },
  { id: KOMYO, h: 14, m: 7, stay: 30, legs: [walk(3)] },
  { id: KYUHAKU, h: 14, m: 44, stay: 60, legs: [walk(7)] },
  { id: TENKAI, h: 15, m: 56, stay: 34, legs: [walk(12)] },
];
const DAY2_PLAN: Plan = [
  { id: MIZUKI, h: 9, m: 0, stay: 40, legs: [] },
  { id: KANZEON, h: 10, m: 17, stay: 35, legs: [walk(37)] },
  { id: KAIDAN, h: 10, m: 54, stay: 25, legs: [walk(2)] },
  { id: KYAKKAN, h: 11, m: 43, stay: 25, legs: [walk(24)] },
  { id: ENOKI, h: 12, m: 14, stay: 30, legs: [walk(6)] },
  { id: SEICHO, h: 13, m: 2, stay: 55, legs: [walk(18)] },
  { id: TENJIKAN, h: 14, m: 1, stay: 30, legs: [walk(4)] },
  { id: SAKAMOTO, h: 14, m: 39, stay: 15, legs: [walk(8)] },
  { id: KOKUBUNJI, h: 15, m: 9, stay: 30, legs: [walk(15)] },
  { id: KAMADO, h: 15, m: 54, stay: 58, legs: [taxi(15)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [KYUHAKU, TENKAI, TENMANGU, SANDO, HOMOTSU, KANKO, KOMYO, FUREAI].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2_PLAN.map((p) => p.id).join()) throw new Error("2日目の構成が想定と違います");
  if (d1.spots.find((x) => x.id === FUREAI)!.photos.length) throw new Error("外すスポットに写真があります");
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
  console.log(`\n外すスポット: ${FUREAI}（太宰府市文化ふれあい館）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, build(DAY1_PLAN) as never, { tx, remove: [FUREAI] });
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

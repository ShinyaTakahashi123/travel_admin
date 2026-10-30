/**
 * 初日・最終日の見直し #44 050431ba「青森の港町と縄文遺跡、八甲田ロープウェーもめぐる1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 18:38、#37〜#44 は制作補助2。四季）
 * 歩きは routed-foot、車は routed-car（もとの値が ×1.5＋5 の内側ならそのまま、外れる区間・新しい区間は切り上げ＋5、歩きは切り上げ）
 * 1日目（午前は歩き、レンタカーは昼食のあとに青森駅で借りる）: JR青森駅 10:40ごろ → 歩5（345m）→ 青森ベイブリッジ 10:45（25→15）→ 歩3（163m、もとのまま）→ 八甲田丸 11:03（40→35）→
 *   歩8（603m。もと4）→ ねぶたの家ワ・ラッセ 11:46（35→30）→ 歩12（858m。もと9）→ アスパム 12:28（30→20）→ 歩8（577m。もと5）→ 善知鳥神社 12:56（35→30）→ 歩4（300m。もとは「すぐ」）→
 *   新町通り（昼食）13:30〜14:10（60→40。OSM の食事処の点が 200m内に11）→ 歩13（933m）で青森駅＋レンタカー（手続き15分）＋車8（3.7km、もとのまま）→ 合浦公園 14:46（60→34。企画運営 10/30: 余りの19分を短くした滞在に戻す）→
 *   車20（12.2km、もとのまま）→ 浅虫水族館 15:40〜17:00（80）→ 車7（1.1km）で浅虫温泉の宿
 *   外したもの: 青森市森林博物館（9:00。青森駅の西で、タイトル・説明文になく、2日目にも入らない）
 * 2日目（16:37 に出るのはもとのまま。昼食を 60→40 にした20分は、出発を 9:00→9:18 にしてのみこむ。ロープウェーは公式 https://hakkoda-ropeway.jp/fare_time/「所要時間 約10分」で上り下りとも10、もとの上り12の2分も出発でのみこむ。法務 10/30）: 浅虫温泉の宿 → 車30（20.1km、もとのまま）→ 三内丸山遺跡 9:18（60）→
 *   車23（10.6km。もと15）→ 小牧野遺跡 10:41（90）→ 車30（22.6km、もとのまま）→ 八甲田山麓（昼食）12:41〜13:21（60→40。OSM「レストハウス八甲田」restaurant way 480005940 が約30m）→
 *   ロープウェー10（もと12）→ 八甲田ロープウェー（山頂公園）13:31（100）→ ロープウェー10で山麓駅（メモ「およそ10分で登ります」）＋車26（23.0km。もと40）→ 青龍寺 15:47〜16:37（50）→
 *   車15（10.3km、もとのまま）で青森駅、レンタカーを返す（15分）
 * 点: 青森ベイブリッジ＝OSM「青森ベイブリッジ」man_made=bridge way 695946241 の、八甲田丸に近い頂点 node 6535028263（いまは橋の西のはしのそばで、歩く道が遠回りになる）／
 *   ねぶたの家ワ・ラッセ＝Nominatim way 138098524（40.8295723,140.7359460。いまは約2m）／アスパム＝OSM「青森観光物産館アスパム」node 8742161941（いまは約5m）／
 *   新町通り（昼食）＝OSM「新町通り」way 225654058 の頂点 node 8871916644（いまの点から約29m）／合浦公園＝OSM「合浦公園」park way 102670930 の頂点 node 10001259187（いまは公園の面の中）／
 *   三内丸山遺跡＝Nominatim「大型竪穴建物（復元）」way 651488544（40.8118528,140.6968335。メモに一文を足す）／青龍寺＝Nominatim「昭和大仏」way 1191589251（40.8221152,140.8184437。メモの昭和大仏。いまは約300m西）
 *   八甲田丸・浅虫水族館・山麓・山頂公園は Nominatim の値を6けたにしたいまの点、善知鳥神社（node 2343164496）・小牧野遺跡（node 2477666217）もいまの点のまま
 * 文の出典: 三内丸山遺跡 https://sannaimaruyama.pref.aomori.jp/about/door/「遺跡の規模は、全体で約42ヘクタールあります」、
 *   https://sannaimaruyama.pref.aomori.jp/about/iseki/「三内丸山遺跡では最大のもので長さ約32メートル、幅約10メートルのものが見つかっています。」、
 *   https://aomori-tourism.com/spot/detail_7.html「復元された15棟の竪穴住居、大型竪穴住居、3棟の高床建物、大型掘立柱建物が見どころです。」
 *   （もとの「1700年」「600軒を超える」「500人ほど」は、開いたページで確かめられないので外す）
 *   合浦公園 https://www.gltjp.com/ja/directory/item/14260/「水原衛作と柿崎巳十郎の兄弟が私財をなげうって造成し、明治27年(1894）に完成。青森市に寄付された。」
 *   （もとの「もとは青森公園という名」と「天然記念物に指定されている老松『三誉の松』」は、開いたページで確かめられないので外す）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-044-050431ba.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "050431ba-9c60-400d-ac75-912c857a90ba";
const DAY1_ID = "78a8bafb-6075-4234-92cd-e07f62016936";
const DAY2_ID = "eaed671c-3118-4c7b-8972-afb1b0e30e61";
const SHINRIN = "87003ba1-a758-417a-8036-295756d0657f";
const BAYBRIDGE = "5d0499fe-8a0a-48c8-a44f-bf31197e53d1";
const HAKKODAMARU = "9dbf405a-e5a8-4a73-9fab-0e7001f808b9";
const WARASSE = "71b317f1-fda2-45cc-8075-4aab0c8b9c02";
const ASPAM = "4e59a026-9a5f-448f-ad8f-9df494167028";
const UTO = "48b204c6-8c75-4bc6-841f-04fae1c7dae3";
const SHINMACHI = "13b903ae-313a-4cf8-8344-bef14ac8e7c1";
const GAPPO = "89b20ad0-4814-4fa2-ad8b-cd00b31bef53";
const AQUA = "a6f50797-ae2e-4dd1-8270-a5c1a196c878";
const SANNAI = "70ce543c-6e4a-45bd-84cf-d1ad82a57968";
const KOMAKINO = "5d3f3931-9d04-4c95-be74-ca0f96a650c1";
const SANROKU = "50d766e6-539f-4396-9171-f2df9641962d";
const ROPEWAY = "a3fb620d-4ca1-4fc6-9db2-e51b2b0e0c08";
const SEIRYU = "a8e52237-c7f5-46a7-bfe7-b7c32a4cf135";
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
  [BAYBRIDGE]: { from: [40.831099, 140.733853], to: [40.8307525, 140.7356317] },
  [WARASSE]: { from: [40.82955, 140.73594], to: [40.8295723, 140.735946] },
  [ASPAM]: { from: [40.829763, 140.741007], to: [40.8297262, 140.7409729] },
  [SHINMACHI]: { from: [40.826017, 140.742656], to: [40.8260817, 140.7423267] },
  [GAPPO]: { from: [40.829742, 140.779065], to: [40.8295837, 140.7769448] },
  [SANNAI]: { from: [40.811001, 140.697562], to: [40.8118528, 140.6968335] },
  [SEIRYU]: { from: [40.821662, 140.814824], to: [40.8221152, 140.8184437] },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [BAYBRIDGE]: [
    { from: "青森市森林博物館から歩いておよそ9分、青森ベイブリッジに着きます。", to: "JR青森駅に10時40分ごろ着いたら、歩いておよそ5分、青森ベイブリッジから旅を始めます。昼までは、港のまわりを歩いてめぐりましょう。" },
  ],
  [HAKKODAMARU]: [
    { from: "船の中を巡ってみましょう。", to: "船の中を巡りましょう。" },
    { from: "この後は、歩いておよそ4分、ねぶたの家ワ・ラッセへ向かいましょう。", to: "この後は、歩いておよそ8分、ねぶたの家ワ・ラッセへ向かいましょう。" },
  ],
  [WARASSE]: [
    { from: "八甲田丸から歩いておよそ4分、", to: "八甲田丸から歩いておよそ8分、" },
    { from: "この後は、歩いておよそ9分、青森県観光物産館アスパムへ向かいましょう。", to: "この後は、歩いておよそ12分、青森県観光物産館アスパムへ向かいましょう。" },
  ],
  [ASPAM]: [
    { from: "ねぶたの家ワ・ラッセから歩いておよそ9分、", to: "ねぶたの家ワ・ラッセから歩いておよそ12分、" },
    { from: "旅のみやげを少し探してみましょう。", to: "旅のみやげを探しましょう。" },
    { from: "この後は、歩いておよそ5分、善知鳥神社へ向かいましょう。", to: "この後は、歩いておよそ8分、善知鳥神社へ向かいましょう。" },
  ],
  [UTO]: [
    { from: "青森県観光物産館アスパムから歩いておよそ5分、", to: "青森県観光物産館アスパムから歩いておよそ8分、" },
    { from: "ここで旅の無事を祈ってみましょう。", to: "ここで旅の無事を祈りましょう。" },
    { from: "この後は、歩いてすぐ、新町通りへ向かいましょう。", to: "この後は、歩いておよそ4分、新町通りへ向かいましょう。" },
  ],
  [SHINMACHI]: [
    { from: "善知鳥神社から歩いてすぐ、", to: "善知鳥神社から歩いておよそ4分、" },
    {
      from: "食事を終えたら、歩いておよそ5分、青森駅の近くの駐車場へ戻り、車に乗りましょう。この後は、車でおよそ8分、合浦公園へ向かいましょう。",
      to: "食事を終えたら、歩いておよそ13分で青森駅へ戻り、駅の近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ8分、合浦公園へ向かいましょう。",
    },
  ],
  [GAPPO]: [
    { from: "新町通りから車でおよそ8分、", to: "新町通りから、歩きと車であわせておよそ36分、" },
    { from: "もとは「青森公園」という名でしたが、同じころに「合浦公園」と改められました。", to: "" },
    { from: "園内には、天然記念物に指定されている老松「三誉の松」をはじめ、松林に囲まれた池など、", to: "園内には、松林に囲まれた池など、" },
    { from: "のんびりと歩いてみましょう。", to: "のんびりと歩きましょう。" },
  ],
  [AQUA]: [{ from: "見学を終えたら、湯の島を望む浅虫の海辺を少し歩いてから、今夜の宿に向かいましょう。", to: "見学を終えたら、この夜は、車でおよそ7分の浅虫温泉の宿に泊まりましょう。" }],
  [SANNAI]: [
    {
      from: "およそ42ヘクタールという広い範囲に、縄文時代の人々が1700年ものあいだ暮らしたとされる集落の跡です。これまでに600軒を超える住居の跡が見つかっており、もっとも栄えていたころには、およそ500人ほどが暮らしていたとも考えられています。",
      to: "全体でおよそ42ヘクタールという広い範囲に広がる、縄文時代の大きな集落の跡です。復元された竪穴住居や高床建物、大型掘立柱建物などが立ち並び、大型竪穴建物は、見つかった中で最大のもので長さおよそ32メートル、幅およそ10メートルとされています。",
    },
    { from: "縄文の人々の暮らしの跡を感じてみましょう。", to: "縄文の人々の暮らしの跡を感じましょう。" },
    { from: "この後は、車でおよそ15分、小牧野遺跡へ向かいましょう。", to: "この後は、車でおよそ23分、小牧野遺跡へ向かいましょう。" },
  ],
  [KOMAKINO]: [{ from: "三内丸山遺跡から車でおよそ15分、", to: "三内丸山遺跡から車でおよそ23分、" }],
  [SANROKU]: [
    {
      from: "八甲田山麓に着きます。山の景色を眺めながら、郷土の味を楽しんで昼食をとりましょう。この後は、ロープウェーに乗り、山頂公園駅へ向かいましょう。",
      to: "八甲田ロープウェーの山麓駅に着きます。駅のそばには食事処もあるので、ここで昼食をとりましょう。この後は、ロープウェーに乗り、およそ10分で山頂公園駅へ向かいましょう。",
    },
  ],
  [ROPEWAY]: [
    { from: "八甲田山麓からロープウェーに乗り、山頂公園駅に着きます。", to: "八甲田山麓からロープウェーに乗り、およそ10分で山頂公園駅に着きます。" },
    { from: "この後は、車でおよそ40分、青龍寺へ向かいましょう。", to: "この後は、ロープウェーでおよそ10分の山麓駅へ戻り、車でおよそ26分、青龍寺へ向かいましょう。" },
  ],
  [SEIRYU]: [
    { from: "八甲田ロープウェーから車でおよそ40分、", to: "八甲田ロープウェーから、ロープウェーと車であわせておよそ36分、" },
    { from: "境内を歩いてみましょう。", to: "境内を歩きましょう。" },
    { from: "見学を終えたら、車でおよそ15分、青森駅へ向かい、レンタカーを返しましょう。", to: "見学を終えたら、車でおよそ15分の青森駅でレンタカーを返しましょう（返す手続きに15分ほど）。" },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: BAYBRIDGE, h: 10, m: 45, stay: 15, legs: [] },
  { id: HAKKODAMARU, h: 11, m: 3, stay: 35, legs: [walk(3)] },
  { id: WARASSE, h: 11, m: 46, stay: 30, legs: [walk(8)] },
  { id: ASPAM, h: 12, m: 28, stay: 20, legs: [walk(12)] },
  { id: UTO, h: 12, m: 56, stay: 30, legs: [walk(8)] },
  { id: SHINMACHI, h: 13, m: 30, stay: 40, legs: [walk(4)] },
  { id: GAPPO, h: 14, m: 46, stay: 34, legs: [walk(13), other(15, "レンタカーの手続き"), car(8)] },
  { id: AQUA, h: 15, m: 40, stay: 80, legs: [car(20)] },
];
const DAY2: Plan = [
  { id: SANNAI, h: 9, m: 18, stay: 60, legs: [] },
  { id: KOMAKINO, h: 10, m: 41, stay: 90, legs: [car(23)] },
  { id: SANROKU, h: 12, m: 41, stay: 40, legs: [car(30)] },
  { id: ROPEWAY, h: 13, m: 31, stay: 100, legs: [other(10, "ロープウェー")] },
  { id: SEIRYU, h: 15, m: 47, stay: 50, legs: [other(10, "ロープウェー"), car(26)] },
];
const REMOVE1 = [SHINRIN];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [SHINRIN, BAYBRIDGE, HAKKODAMARU, WARASSE, ASPAM, UTO, SHINMACHI, GAPPO, AQUA].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2.map((p) => p.id).join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  const ropeLegs = all.find((x) => x.id === ROPEWAY)!.transitLegs;
  console.log(`もとのロープウェーの移動: ${ropeLegs.map((l) => `${l.transitMode}${l.transitDurationMin}(${l.transitLine ?? ""})`).join("+")}`);
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
  for (const id of REMOVE1) console.log(`外す: ${all.find((x) => x.id === id)!.name}`);
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "すぐ", "ホテル", "旅館", "締めくくり", "森林博物館"])
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
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx, remove: REMOVE1 });
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

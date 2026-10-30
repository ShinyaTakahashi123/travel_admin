/**
 * 初日・最終日の見直し #38 76714b9f「雄島と三国湊、丸岡城と永平寺。福井の海と歴史をめぐる1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 18:38、#37〜#44 は制作補助2）
 * 車は OSRM、歩きは routed-foot（もとの値が ×1.5＋5 の内側ならそのまま、外れる区間・新しい区間は切り上げ＋5、歩きは切り上げ）
 * 1日目: 芦原温泉駅 10:30ごろ → レンタカー（手続き15分）→ 車24（19.0）→ 雄島 11:09（60→40）→ 車8（4.9）→ 越前松島 11:57（55→30）→ 車12（7.6）→ 三國神社 12:39（30→20）→
 *   車7（2.0）→【新】三国駅のまわり 13:06〜13:56（昼食。えちぜん鉄道 三国駅 node 264457777、まわりに OSM の食事処・カフェの点11。企画運営: もとは旧森田銀行の「見学を終えたら昼食」で13:30を過ぎる）→
 *   歩7（505m）→ 旧岸名家 14:03（20→15）→ 歩3 → 旧森田銀行本店 14:21（70→30）→ 歩8（583m）で三国駅のそばの車＋車7（1.6）（もと「歩6＋車5」の11）→ 瀧谷寺 15:06（45→30）→
 *   車7（2.0。もと9）→ みくに龍翔館 15:43（45→30）→ 車10（7.1）→ あわら湯のまち広場（芦湯）16:23〜16:53（70→30）→ あわら温泉の宿
 * 2日目（16:32 に出るのはもとのまま）: 宿 → 車20 → 丸岡城 9:07（決まり369の②。もと 9:00）→ 歩7（517m。もと4）→ 一筆啓上 日本一短い手紙の館 10:04 → 車20（14.3。もと30）→
 *   永平寺 10:54（100→60）→ 歩4（280m）→【新】永平寺の門前 11:58〜12:38（昼食。寺の滞在の中の昼食は不可、法務・企画運営。地理院の地名検索「永平寺郵便局」の値。
 *   永平寺町観光物産協会の散策コース https://fuku-e.com/lsc/upfile/spot/0000/4966/4966_d001_file.pdf「永平寺門前 … お土産・食事」）→ 歩4で永平寺の車＋車14（8.4。法務）→
 *   【新】福井県立一乗谷朝倉氏遺跡博物館 12:56〜14:02（OSM museum way 1040457411。公式 https://asakura-museum.pref.fukui.lg.jp/「170万点にも及ぶ出土品」「朝倉氏の館を復元」）→
 *   車9（3.8）→ 一乗谷朝倉氏遺跡（朝倉館跡）14:11〜15:17（145→66。企画運営: 1か所は100分ほどまで、博物館と分ける）→ 車20（13.2）→ 養浩館庭園 15:37〜16:32 → 車7（1.8）で福井駅、レンタカーを返す（15分）
 * 説明文の「北陸唯一の現存天守」に「とされる」のぼかし（法務）
 * 点: 雄島＝OSM「大湊神社」（雄島の上の社）way 585913985（いまは島の relation の中心）／越前松島＝islet relation 11668483 の node 1442992932（いまは relation の中心）／
 *   旧岸名家＝地理院「北本町四丁目6番54号」（OSM は案内板だけ。いまは案内板の点）／あわら湯のまち広場＝OSM「芦湯 (足湯)」way 766395439（いまは案内図の点。メモに芦湯）／
 *   一乗谷朝倉氏遺跡＝OSM「朝倉館跡」historic node 3161039841（いまは案内板の点）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-038-76714b9f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "76714b9f-c63d-48ad-9f1d-264967be6714";
const DAY1_ID = "e6b8b549-29bd-42ba-be2f-6ba3f8986bb7";
const DAY2_ID = "d9cfa14b-9425-408a-a306-6e8ad91da339";
const OJIMA = "e9ead90f-cff8-461f-8474-7989c4c1c253";
const MATSU = "1a1a7186-49c5-4032-acfb-b8976887d3f2";
const MIKUNI = "1736aa4b-dace-4b82-9195-5073c1961de2";
const KISHI = "8bc30e5f-6177-4cc1-b707-bef06b20317e";
const MORITA = "8266f227-eb41-4d9e-8c05-c14b2b31e0ae";
const TAKI = "cdda35f9-bbd1-4281-969e-33dee46382a1";
const RYU = "103199f4-d876-4fe4-b390-2f804c1fa4e3";
const ASHI = "cff29c02-6b01-495e-8e6b-d20e08b95a98";
const MARU = "62575267-8365-491e-81d0-3ea307fc6d41";
const IPPITSU = "f18ef3fd-a89c-4798-b965-1e69e49d9454";
const EIHEI = "fab2b894-328c-4fac-8cbc-6c6dbe5ad616";
const ICHIJO = "ad6e86d8-ff3b-4c18-b862-d5bd7c7ed41d";
const YOKO = "9de1b3df-3721-46b4-a8de-344482c24d0a";
const LUNCH1 = "new-mikuni";
const LUNCH2 = "new-monzen";
const MUSEUM = "new-asakura-museum";
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
  [OJIMA]: { from: [36.251754, 136.11904], to: [36.250666, 136.119723] },
  [MATSU]: { from: [36.255307, 136.147024], to: [36.254995, 136.146872] },
  [KISHI]: { from: [36.213935, 136.148694], to: [36.213902, 136.148773] },
  [ASHI]: { from: [36.223843, 136.192836], to: [36.223834, 136.192625] },
  [ICHIJO]: { from: [36.008924, 136.300763], to: [35.999536, 136.295375] },
};

const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const DESC_FROM = "北陸唯一の現存天守・丸岡城";
const DESC_TO = "北陸で唯一とされる現存天守・丸岡城";

const NEW: Record<string, { name: string; lat: number; lng: number; address: string; memo: string }> = {
  [LUNCH1]: {
    name: "三国駅のまわり（昼食）",
    lat: 36.217131,
    lng: 136.149575,
    address: "福井県坂井市三国町",
    memo: "三國神社から車でおよそ7分。三国駅のまわりの三国湊の町なかには食事処もあるので、ここで昼食をとりましょう。食事を終えたら、車をとめたまま、歩いておよそ7分、旧岸名家へ向かいましょう。",
  },
  [LUNCH2]: {
    name: "永平寺の門前（昼食）",
    lat: 36.055181,
    lng: 136.353983,
    address: "福井県吉田郡永平寺町志比",
    memo: "永平寺から歩いておよそ4分。参道沿いの門前には、お土産の店や食事処が並んでいるので、ここで昼食をとりましょう。食事を終えたら、歩いておよそ4分で永平寺にとめた車に戻り、車でおよそ14分、一乗谷朝倉氏遺跡博物館へ向かいましょう。",
  },
  [MUSEUM]: {
    name: "福井県立一乗谷朝倉氏遺跡博物館",
    lat: 36.01527,
    lng: 136.298271,
    address: "福井県福井市安波賀中島町",
    memo: "永平寺の門前から歩いておよそ4分で車に戻り、車でおよそ14分。一乗谷朝倉氏遺跡の出土品を展示する県立の博物館で、170万点にもおよぶ出土品をもとに、朝倉氏の戦国城下町・一乗谷の全体像や歴史を紹介しています。朝倉氏の館を復元した展示もあり、戦国大名の文化にふれられます。休館日は公式の案内で確かめましょう。見学を終えたら、車でおよそ9分、遺跡の中心の朝倉館跡へ向かいましょう。",
  },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [OJIMA]: [
    {
      from: "この旅は、JR芦原温泉駅でレンタカーを借りて、雄島から始まります(福井駅での乗り捨てができる店を選びましょう)。",
      to: "JR芦原温泉駅に10時半ごろ着いたら、駅でレンタカーを借りて（手続きに15分ほど。福井駅で返せる店を選びましょう）、車でおよそ24分、雄島から旅を始めます。",
    },
    { from: "東尋坊から車ですぐ、", to: "東尋坊の北にある、" },
    { from: "今も参拝の対象となっている神域ですので、静かに、敬意をもって島内を歩きましょう。", to: PRAY_TO },
    { from: "足元に注意してください。", to: "足元に注意しましょう。" },
  ],
  [MIKUNI]: [
    { from: "参拝の際は、敬意を込めて手を合わせましょう。", to: PRAY_TO },
    { from: "この後は、車でおよそ3分、旧岸名家へ向かいましょう。", to: "この後は、車でおよそ7分、三国駅のまわりで昼食にしましょう。" },
  ],
  [KISHI]: [{ from: "三國神社から車でおよそ3分、旧岸名家に着きます。", to: "三国駅のまわりから歩いておよそ7分、旧岸名家に着きます。" }],
  [MORITA]: [
    {
      from: "このあたりには食事処もいくつかあるので、見学を終えたら昼食にしましょう。この後は、歩いておよそ6分で車を停めた場所まで戻り、瀧谷寺まで車でおよそ5分向かいましょう。",
      to: "この後は、歩いておよそ8分で三国駅のそばにとめた車に戻り、車でおよそ7分、瀧谷寺へ向かいましょう。",
    },
  ],
  [TAKI]: [
    { from: "旧森田銀行本店から、車に戻って瀧谷寺まで、あわせておよそ11分。", to: "旧森田銀行本店から歩いておよそ8分で車に戻り、車でおよそ7分。" },
    { from: "参拝の際は、敬意を込めて手を合わせましょう。", to: PRAY_TO },
    { from: "この後は、車でおよそ9分、みくに龍翔館へ向かいましょう。", to: "この後は、車でおよそ7分、みくに龍翔館へ向かいましょう。" },
  ],
  [RYU]: [{ from: "瀧谷寺から車でおよそ9分、", to: "瀧谷寺から車でおよそ7分、" }],
  [ASHI]: [
    { from: "一日の締めくくりに、", to: "一日の終わりに、" },
    { from: "足湯で旅の疲れを癒やしてから、今夜の宿へ向かいましょう。", to: "足湯で旅の疲れを癒やしましょう。この夜は、あわら温泉の宿に泊まりましょう。" },
  ],
  [MARU]: [
    { from: "北陸で唯一の現存天守を持つ城で、", to: "北陸で唯一の現存天守を持つとされる城で、" },
    { from: "この後は、歩いてすぐ、", to: "この後は、歩いておよそ7分、" },
  ],
  [IPPITSU]: [
    { from: "丸岡城から歩いてすぐ、", to: "丸岡城から歩いておよそ7分、" },
    { from: "思いの重みを感じてみましょう。", to: "思いの重みを感じましょう。" },
    { from: "この後は、車でおよそ30分、", to: "この後は、車でおよそ20分、" },
  ],
  [EIHEI]: [
    { from: "一筆啓上日本一短い手紙の館から車でおよそ30分、", to: "一筆啓上日本一短い手紙の館から車でおよそ20分、" },
    { from: "拝観の際は、修行の場であることに敬意を払い、静かに歩きましょう。", to: `拝観の際は、修行の場であることに敬意を払いましょう。${PRAY_TO}` },
    {
      from: "門前には食事処もあるので、ここで昼食にしましょう。この後は、車でおよそ18分、一乗谷朝倉氏遺跡へ向かいましょう。",
      to: "この後は、歩いておよそ4分、永平寺の門前で昼食にしましょう。",
    },
  ],
  [ICHIJO]: [
    { from: "永平寺から車でおよそ18分、一乗谷朝倉氏遺跡に着きます。", to: "一乗谷朝倉氏遺跡博物館から車でおよそ9分、遺跡の中心の朝倉館跡のあたりに着きます。" },
    { from: "あわせて歩いてみましょう。", to: "あわせて歩きましょう。" },
  ],
  [YOKO]: [
    {
      from: "福井駅でレンタカーを返却し、帰りの電車に乗りましょう。",
      to: "見学を終えたら、車でおよそ7分の福井駅でレンタカーを返し（返す手続きに15分ほど）、帰りの電車に乗りましょう。",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: OJIMA, h: 11, m: 9, stay: 40, legs: [] },
  { id: MATSU, h: 11, m: 57, stay: 30, legs: [car(8)] },
  { id: MIKUNI, h: 12, m: 39, stay: 20, legs: [car(12)] },
  { id: LUNCH1, h: 13, m: 6, stay: 50, legs: [car(7)] },
  { id: KISHI, h: 14, m: 3, stay: 15, legs: [walk(7)] },
  { id: MORITA, h: 14, m: 21, stay: 30, legs: [walk(3)] },
  { id: TAKI, h: 15, m: 6, stay: 30, legs: [walk(8), car(7)] },
  { id: RYU, h: 15, m: 43, stay: 30, legs: [car(7)] },
  { id: ASHI, h: 16, m: 23, stay: 30, legs: [car(10)] },
];
const DAY2: Plan = [
  { id: MARU, h: 9, m: 7, stay: 50, legs: [] },
  { id: IPPITSU, h: 10, m: 4, stay: 30, legs: [walk(7)] },
  { id: EIHEI, h: 10, m: 54, stay: 60, legs: [car(20)] },
  { id: LUNCH2, h: 11, m: 58, stay: 40, legs: [walk(4)] },
  { id: MUSEUM, h: 12, m: 56, stay: 66, legs: [walk(4), car(14)] },
  { id: ICHIJO, h: 14, m: 11, stay: 66, legs: [car(9)] },
  { id: YOKO, h: 15, m: 37, stay: 55, legs: [car(20)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [OJIMA, MATSU, MIKUNI, KISHI, MORITA, TAKI, RYU, ASHI].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [MARU, IPPITSU, EIHEI, ICHIJO, YOKO].join()) throw new Error("2日目の構成が想定と違います");
  if ((it.description ?? "").split(DESC_FROM).length !== 2) throw new Error("説明文の置き換え元が見つかりません");
  const desc = (it.description ?? "").replace(DESC_FROM, DESC_TO);
  console.log(`説明文: ${desc}`);
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
  for (const [id, n] of Object.entries(NEW)) all.push({ ...n, id, visitTime: null, stayDurationMin: null, transitLegs: [] } as never);
  for (const n of Object.values(NEW)) console.log(`新しいスポット: ${n.name}（${n.lat},${n.lng}）\n  ${n.memo}`);
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? NEW[p.id]?.memo ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "手を合わせ", "締めくくり、", "すぐ、", "ホテル", "旅館"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」が残っています`));
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
    plan.map((p) =>
      NEW[p.id]
        ? {
            create: {
              name: NEW[p.id].name,
              visitTime: t(p.h, p.m),
              stayDurationMin: p.stay,
              transitLegs: { create: legsCreate(p.legs) },
              lat: NEW[p.id].lat,
              lng: NEW[p.id].lng,
              address: NEW[p.id].address,
              memo: NEW[p.id].memo,
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
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: desc } });
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

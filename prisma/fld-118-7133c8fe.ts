/**
 * 初日・最終日の見直し #118 7133c8fe「祖谷渓の展望台と落合集落、秘境の絶景と茅葺きの里1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 10時ごろ、#110〜#123 は制作補助2）
 * 車は OSRM（もとの値が ×1.5＋5 の内側ならそのまま、新しい区間・外れる区間は切り上げ＋5）。もとは「車でめぐります」だけで借りる・返す場所がないので、阿波池田駅で借りて返す
 * 1日目: 阿波池田駅 10:30ごろ → レンタカー（手続き15分）→ 車24（18.3）→ 祖谷渓 小便小僧展望台 11:09（40）→ 車19（13.3、もとのまま）→ 平家屋敷民俗資料館 12:08（70→60）→
 *   車11（5.5。もと15）→ 道の駅にしいや 13:19〜14:19（昼食、70→60）→ 車18（12.5。もと38）→ 龍宮崖公園 14:37（65→60）→ 車10（4.2。もと15）→
 *   東祖谷歴史民俗資料館 15:47〜16:47（75→60）→ 京上のまわりの宿
 * 2日目（16:30 に出るのはもとのまま）: 西から東へ並べ直す（もとは 落合集落→展望所→伝習施設→鉾杉→喜多家→かかしの里 で、喜多家→かかしの里が「車70」、昼食は喜多家の文に「このあたりで」だけ）
 *   宿 → 車17（12.0）→ 鉾杉 9:30（25）→ 歩1（57m。もと車2）→ 武家屋敷旧喜多家 9:56（65）→ 歩1で鉾杉のそばの車＋車24（18.2）→ 落合集落 11:26（60）→ 車9（3.6）→
 *   【新】落合橋のまわり 12:35〜13:35（昼食。バス停「落合橋」node 278091514。そば道場 るるぶ https://rurubu.jp/andmore/spot/80035694「落合橋バス停のすぐ近く」）→ 車10（4.9）→
 *   落合集落展望所 13:45（15）→ 車19（13.3）→ 天空の村・かかしの里 14:19（55）→ 車8（2.2。もと18）→ 奥祖谷二重かずら橋 15:22（53）→ 歩2（129m）→
 *   【新】野猿 16:17〜16:30（四国地方整備局「四国八十八景」 https://www.skr.mlit.go.jp/kikaku/88-kei/topics/01select/H28_004.pdf「野猿で対岸に渡るのも楽しい」。企画運営）→
 *   車69（63.6）で阿波池田駅、レンタカーを返す（15分）
 * 外す: 栗枝渡八幡神社・三好市東祖谷郷土文化保存伝習施設（企画運営 10/30。OSM になく、地理院の住所検索も大字まで、地理院地図ではどちらも道路の上の点でそばに建物の形がない。写真なし）
 * 点: 小便小僧展望台＝OSM「祖谷渓の小便小僧」artwork node 4197431241（いまは約8km南西の 4けたの点）／道の駅にしいや＝services way 304159961（いまは食事処の点）／
 *   野猿＝OSM「野猿猴橋」aerialway way 1230085622 の北西の端の node 4974401321
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-118-7133c8fe.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "7133c8fe-1bb5-4d3f-b644-653c74f59419";
const DAY1_ID = "2c9ac663-907d-49ee-85b1-799cbe5e3c3b";
const DAY2_ID = "c3d2ba8c-8adb-4c7d-a935-b270b2d0473c";
const SHOBEN = "e30e9897-e17f-474e-bb46-9e5f1743d834";
const HEIKE = "38381b17-fa86-4f75-a90a-d01993b8ca03";
const NISHIIYA = "5b34be24-98ba-47cb-8635-a4dd761f8fc4";
const RYUGU = "84d76eac-1c2f-4961-871e-b1af9b69b461";
const HIGASHI = "aa1667b1-d62f-42f4-8acf-cebad75ac488";
const KURISHIDO = "8ca1f655-22eb-4f75-9822-4e957bbb9bdb";
const OCHIAI = "b0fff95a-b616-4f51-959d-23473ac7b0a0";
const TENBO = "dde3d581-fc81-47df-9f6c-ae6c9f73b6de";
const DENSHU = "962b664a-7bef-4ebf-ade9-f810496e8643";
const HOKO = "7d6bbc2e-ffbc-4f86-bcf8-b38408d0c501";
const KITA = "aab3cdfd-36eb-479c-8cce-1de840ee2688";
const KAKASHI = "3e11e257-ede0-49e8-85b8-0451c97021c8";
const KAZURA = "c5478074-f7bd-4a3e-8e48-624a437a69f0";
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
  [SHOBEN]: { from: [33.8514, 133.7908], to: [33.923598, 133.818534] },
  [NISHIIYA]: { from: [33.888856, 133.811018], to: [33.888792, 133.810954] },
};


const LUNCH = "new-ochiaibashi";
const YAEN = "new-yaen";
const NEW: Record<string, { name: string; lat: number; lng: number; address: string; memo: string }> = {
  [LUNCH]: {
    name: "落合橋のまわり（昼食）",
    lat: 33.880339,
    lng: 133.937329,
    address: "徳島県三好市東祖谷落合",
    memo: "落合集落から車でおよそ9分。祖谷川にかかる落合橋のまわりには、祖谷そばを味わえる食事処もあるので、ここで昼食をとりましょう。食事を終えたら、車でおよそ10分、落合集落展望所へ向かいましょう。",
  },
  [YAEN]: {
    name: "野猿",
    lat: 33.853922,
    lng: 134.046352,
    address: "徳島県三好市東祖谷菅生",
    memo: "奥祖谷二重かずら橋から歩いておよそ2分。谷の上を渡る「野猿」で、対岸へ渡ることもできます。順番を守り、無理をしないようにしましょう。利用できる期間や時間は、訪れる前に公式の案内で確かめましょう。見学を終えたら、車でおよそ69分の阿波池田駅でレンタカーを返しましょう（返す手続きに15分ほど）。",
  },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [SHOBEN]: [
    {
      from: "この旅は、車でめぐります。最初に向かうのは、祖谷渓 小便小僧展望台です。",
      to: "この旅は、車でめぐります。JR阿波池田駅に10時半ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ24分、祖谷渓 小便小僧展望台から旅を始めます。",
    },
    { from: "柵の内側から眺めてみましょう。", to: "柵の内側から眺めましょう。" },
  ],
  [HEIKE]: [{ from: "祖谷の歴史に触れてみましょう。", to: "祖谷の歴史に触れましょう。" }],
  [NISHIIYA]: [{ from: "平家屋敷民俗資料館からは車でおよそ15分です。", to: "平家屋敷民俗資料館からは車でおよそ11分です。" }],
  [RYUGU]: [
    { from: "道の駅にしいやからは車でおよそ38分です。", to: "道の駅にしいやからは車でおよそ18分です。" },
    { from: "揺れる吊り橋のスリルを味わってみましょう。", to: "揺れる吊り橋のスリルを味わいましょう。" },
  ],
  [HIGASHI]: [
    { from: "龍宮崖公園からは車でおよそ15分です。", to: "龍宮崖公園からは車でおよそ10分です。" },
    { from: "じっくりと学ぶことができます。", to: "じっくりと学ぶことができます。この夜は、京上のまわりの宿に泊まりましょう。" },
  ],
  [HOKO]: [
    { from: "三好市東祖谷郷土文化保存伝習施設からは車でおよそ5分です。", to: "この旅は、車でめぐります。京上のまわりの宿から車でおよそ17分、2日目は鉾杉から始めます。" },
    { from: "大杉の姿を、見上げてみましょう。", to: "大杉の姿を、見上げましょう。" },
  ],
  [KITA]: [
    { from: "鉾杉からは車でおよそ2分です。", to: "鉾杉からは歩いておよそ1分です。" },
    { from: "このあたりで、道の駅や集落の食事処で昼食をとりましょう。隣接する鉾神社の鉾杉とあわせて、にし阿波のおすすめビューポイントに選ばれています。", to: "" },
    { from: "祖谷の武家の暮らしぶりをしのんでみましょう。", to: "祖谷の武家の暮らしぶりをしのびましょう。この後は、歩いておよそ1分で鉾杉のそばにとめた車に戻り、車でおよそ24分、落合集落へ向かいましょう。" },
  ],
  [OCHIAI]: [
    { from: "この旅は、車でめぐります。旅の2日目は、落合集落からです。", to: "武家屋敷旧喜多家から歩いておよそ1分で車に戻り、車でおよそ24分、落合集落に着きます。" },
    { from: "茅葺きの里を、じっくりと眺めてみてください。", to: "茅葺きの里を、じっくりと眺めましょう。" },
    { from: "続いては、車でおよそ3分の落合集落展望所から、この集落の全体を見渡してみましょう。", to: "この後は、車でおよそ9分、落合橋のまわりで昼食にしましょう。" },
  ],
  [TENBO]: [
    { from: "落合集落からは車でおよそ3分です。", to: "落合橋のまわりからは車でおよそ10分です。" },
    { from: "少し離れた場所から眺めてみましょう。", to: "少し離れた場所から眺めましょう。この後は、車でおよそ19分、天空の村・かかしの里へ向かいましょう。" },
  ],
  [KAKASHI]: [
    { from: "武家屋敷旧喜多家からは車でおよそ70分です。", to: "落合集落展望所からは車でおよそ19分です。" },
    { from: "山里ののどかな風景を楽しんでみましょう。", to: "山里ののどかな風景を楽しみましょう。" },
  ],
  [KAZURA]: [
    { from: "天空の村・かかしの里からは車でおよそ18分です。", to: "天空の村・かかしの里からは車でおよそ8分です。" },
    { from: "秘境らしい景観を味わってみましょう。見学を終えたら、車で帰りましょう。", to: "秘境らしい景観を味わいましょう。この後は、歩いておよそ2分、谷を渡る野猿へ向かいましょう。" },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: SHOBEN, h: 11, m: 9, stay: 40, legs: [] },
  { id: HEIKE, h: 12, m: 8, stay: 60, legs: [car(19)] },
  { id: NISHIIYA, h: 13, m: 19, stay: 60, legs: [car(11)] },
  { id: RYUGU, h: 14, m: 37, stay: 60, legs: [car(18)] },
  { id: HIGASHI, h: 15, m: 47, stay: 60, legs: [car(10)] },
];
const DAY2: Plan = [
  { id: HOKO, h: 9, m: 30, stay: 25, legs: [] },
  { id: KITA, h: 9, m: 56, stay: 65, legs: [walk(1)] },
  { id: OCHIAI, h: 11, m: 26, stay: 60, legs: [walk(1), car(24)] },
  { id: LUNCH, h: 12, m: 35, stay: 60, legs: [car(9)] },
  { id: TENBO, h: 13, m: 45, stay: 15, legs: [car(10)] },
  { id: KAKASHI, h: 14, m: 19, stay: 55, legs: [car(19)] },
  { id: KAZURA, h: 15, m: 22, stay: 53, legs: [car(8)] },
  { id: YAEN, h: 16, m: 17, stay: 13, legs: [walk(2)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [SHOBEN, HEIKE, NISHIIYA, RYUGU, HIGASHI, KURISHIDO].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [OCHIAI, TENBO, DENSHU, HOKO, KITA, KAKASHI, KAZURA].join()) throw new Error("2日目の構成が想定と違います");
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
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? NEW[p.id]?.memo ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "でみ", "いただき", "栗枝渡", "伝習", "ホテル", "旅館"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」が残っています`));
  for (const n of Object.values(NEW)) console.log(`新しいスポット: ${n.name}（${n.lat},${n.lng}）\n  ${n.memo}`);
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
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx, remove: [KURISHIDO] });
      await setDaySpotOrder(DAY2_ID, items(DAY2) as never, { tx, remove: [DENSHU] });
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

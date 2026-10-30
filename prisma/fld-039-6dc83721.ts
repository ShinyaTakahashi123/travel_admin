/**
 * 初日・最終日の見直し #39 6dc83721「さいたま新都心けやきひろばと三橋総合公園、都市型リラックス1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 18:38、#37〜#44 は制作補助2）
 * 歩きは routed-foot、車は OSRM（もとの値が ×1.5＋5 の内側ならそのまま、外れる区間・新しい区間は切り上げ＋5、歩きは切り上げ）
 * 1日目: さいたま新都心駅 10:40ごろ → 歩8（593m）→ けやきひろば 10:48（40→20）→ 歩8＋電車3（さいたま新都心→大宮、Yahoo!路線 乗車3分）＋歩20（大宮駅→1,518m）＝31（もとは歩40。企画運営 10/30）→
 *   武蔵一宮氷川神社 11:39（50→30）→ 歩1（73m。もと8）→
 *   大宮公園 12:10（40→20）→ 歩6（428m。もと3）→ 大宮公園小動物園 12:36（40→20）→ 歩14（1,029m）→【新】大宮公園駅のまわり 13:10〜14:00（昼食。東武 大宮公園駅 node 3654392254、
 *   まわりに OSM の食事処の点8。もとは盆栽美術館 13:42〜 の「近くには食事処」で13:30を過ぎる）→ 歩10（695m）→ 埼玉県立歴史と民俗の博物館 14:10（45→40）→ 歩18（1,343m。もと13）→
 *   大宮盆栽美術館 15:08（50→30）→ 歩9（土呂駅まで634m）＋電車14（土呂→大宮→鉄道博物館、Yahoo!路線 15:08発→15:22着、乗り換え込み）＋歩3（221m）＝26（もと20。法務 10/30）→ 鉄道博物館 16:04〜16:54（100→50）→ 歩29（2,163m）で大宮駅のまわりの宿
 * 2日目（16:31 に出るのはもとのまま）: 宿 → レンタカー（手続き15分）→ 車14（8.2）→ さいたま清河寺温泉 9:03（60）→ 車10（4.8。もと20）→ 三橋総合公園 10:13（70）→ 歩7（499m）→
 *   【新】三橋総合公園南口のまわり 11:30〜12:20（昼食。バス停「三橋総合公園南口」node 2560698810、まわりに OSM の食事処の点14。もとは秋ヶ瀬公園の「近くには食事処」）→
 *   歩7で三橋総合公園の車＋車20（15.0）→ 秋ヶ瀬公園 12:47（60→37）→ 車5（1.6、もとのまま）→ 桜草公園 13:29（25→15）→ 車12（6.8。もと3）→ 荒川彩湖公園 13:56（50→30）→ 車14（8.7。もと8）→
 *   別所沼公園 14:40（40→30）→ 車9（3.7。もと3）→ 玉蔵院 15:19（45→25）→ 車8（2.4。もと2）→ 調神社 15:52〜16:31（40→39）→ 車17（11.1）で大宮駅、レンタカーを返す（15分）
 * 点: けやきひろば＝OSM「けやきひろば」way 27260458／氷川神社＝way 1258998074（ほかのしおりと同じ）／大宮公園＝park relation 17337960 の node 8108046738（いまは面の中心）／
 *   小動物園＝OSM zoo way 580921823（いまは博物館と同じ点）／三橋総合公園＝park relation 12698374 の node 2007735936（いまは約5.6km南東の4けたの点）／
 *   秋ヶ瀬公園＝OSM「野鳥の森」way 459589517 の node 4554000661（メモに野鳥・探鳥地。いまは面の中心）／桜草公園＝OSM「田島ヶ原サクラソウ自生地」node 4551997473／
 *   荒川彩湖公園＝park way 460118506 の node 4557944739（いまは面の中心）／別所沼公園＝OSM「別所沼」water relation 18876314 の node 1379745267（メモは沼のまわり。いまは面の中心）
 *   博物館は地理院「高鼻町四丁目219番地」のまま（OSM に名前の点なし）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-039-6dc83721.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "6dc83721-bc24-44a7-b6c7-bbe59463f0ba";
const DAY1_ID = "118c3154-1e6f-46c1-8629-d1860a37dc9b";
const DAY2_ID = "4c1be21b-561f-4f15-a3f8-03497a69b846";
const KEYA = "0966c437-8a46-4b53-922d-64aa2ef1c6cf";
const HIKAWA = "06b3b98a-4aff-4ae5-81bc-b40013bb2010";
const PARK = "ac6e20a8-a72e-43e5-8622-c3adfd45d792";
const ZOO = "ccb2e7d6-4b30-4ba6-b52d-98e0c4f37462";
const MUSEUM = "294d158f-3854-4e86-afd6-8190a7da937d";
const BONSAI = "30a5295f-8daf-4f1d-b7f6-b55bf1b2aedc";
const TETSU = "9d78e2da-9bdf-41aa-8f4b-00a2dbf60b8b";
const ONSEN = "e2ccacf9-311d-44e1-bb9b-0916515698a8";
const MIHASHI = "e679227f-f532-46d4-a269-2eb1abc31817";
const AKI = "eee93d29-1590-4771-9966-93f40b705dfc";
const SAKURA = "54fb52c6-3b23-4c65-812f-1ac93b53a2b6";
const SAIKO = "2b58e72a-2099-4c99-83dd-e802c17a2de5";
const BESSHO = "c7a478e1-9367-424a-89db-e7861a354dda";
const GYOKU = "868dcd89-3b20-4a05-bed1-048ad8d3d3c8";
const TSUKI = "b4bb8b15-2752-48c7-9522-16c66932d9a6";
const LUNCH1 = "new-omiyakoen";
const LUNCH2 = "new-mihashi";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const car = (min: number) => ({ mode: "car" as const, min });
const train = (min: number, line: string) => ({ mode: "train" as const, min, line });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [KEYA]: { from: [35.894889, 139.630722], to: [35.893225, 139.631176] },
  [HIKAWA]: { from: [35.91675, 139.629733], to: [35.916771, 139.629765] },
  [PARK]: { from: [35.919034, 139.631813], to: [35.916219, 139.63058] },
  [ZOO]: { from: [35.921021, 139.630447], to: [35.918486, 139.632452] },
  [MIHASHI]: { from: [35.8614, 139.6456], to: [35.912527, 139.597443] },
  [AKI]: { from: [35.848611, 139.606885], to: [35.842591, 139.608518] },
  [SAKURA]: { from: [35.837475, 139.613511], to: [35.836689, 139.612508] },
  [SAIKO]: { from: [35.834919, 139.622274], to: [35.83325, 139.622798] },
  [BESSHO]: { from: [35.856515, 139.641149], to: [35.855845, 139.641154] },
};

const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const NEW: Record<string, { name: string; lat: number; lng: number; address: string; memo: string }> = {
  [LUNCH1]: {
    name: "大宮公園駅のまわり（昼食）",
    lat: 35.923825,
    lng: 139.632948,
    address: "埼玉県さいたま市北区盆栽町",
    memo: "大宮公園小動物園から歩いておよそ14分。大宮公園駅のまわりには、そば屋やカフェなどの食事処もあるので、ここで昼食をとりましょう。食事を終えたら、歩いておよそ10分、埼玉県立歴史と民俗の博物館へ向かいましょう。",
  },
  [LUNCH2]: {
    name: "三橋総合公園南口のまわり（昼食）",
    lat: 35.908759,
    lng: 139.596719,
    address: "埼玉県さいたま市西区三橋",
    memo: "三橋総合公園から歩いておよそ7分。公園の南口のまわりの通り沿いには食事処もあるので、ここで昼食をとりましょう。食事を終えたら、歩いておよそ7分で公園にとめた車に戻り、車でおよそ20分、秋ヶ瀬公園へ向かいましょう。",
  },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [KEYA]: [
    { from: "旅の始まりはけやきひろばです。さいたま新都心駅から徒歩2分ほど、", to: "JRさいたま新都心駅に10時40分ごろ着いたら、歩いておよそ8分、けやきひろばから旅を始めます。" },
    { from: "まずはこの都会のオアシスで、ゆったりとした時間を過ごしてみてください。", to: "まずはこの都会のオアシスで、ゆったりとした時間を過ごしましょう。" },
    { from: "この後は、氷川参道を歩いておよそ40分、武蔵一宮氷川神社へ向かいましょう。", to: "この後は、歩いておよそ8分のさいたま新都心駅から電車でおよそ3分の大宮駅へ出て、駅から歩いておよそ20分、武蔵一宮氷川神社へ向かいましょう。" },
  ],
  [HIKAWA]: [
    { from: "けやきひろばから、氷川参道を歩いておよそ40分、", to: "けやきひろばから電車で大宮駅へ出て、駅から歩いておよそ20分、" },
    { from: "今も多くの人が参拝に訪れる祈りの場ですので、境内では静かに、敬意をもってお参りください。", to: PRAY_TO },
    { from: "この後は、歩いておよそ8分、大宮公園へ向かいましょう。", to: "この後は、歩いておよそ1分、となりの大宮公園へ向かいましょう。" },
  ],
  [PARK]: [
    { from: "武蔵一宮氷川神社から歩いておよそ8分、", to: "武蔵一宮氷川神社から歩いておよそ1分、" },
    { from: "緑豊かな園内を、のんびりと歩いてみてください。", to: "緑豊かな園内を、のんびりと歩きましょう。" },
    { from: "この後は、歩いておよそ3分、大宮公園小動物園へ向かいましょう。", to: "この後は、歩いておよそ6分、大宮公園小動物園へ向かいましょう。" },
  ],
  [ZOO]: [
    { from: "大宮公園から歩いておよそ3分、", to: "大宮公園から歩いておよそ6分、" },
    { from: "この後は、歩いておよそ3分、埼玉県立歴史と民俗の博物館へ向かいましょう。", to: "この後は、歩いておよそ14分、大宮公園駅のまわりで昼食にしましょう。" },
  ],
  [MUSEUM]: [
    { from: "大宮公園小動物園から歩いておよそ3分、", to: "大宮公園駅のまわりから歩いておよそ10分、" },
    { from: "埼玉の暮らしと歴史を、じっくりとたどってみてください。", to: "埼玉の暮らしと歴史を、じっくりとたどりましょう。" },
    { from: "この後は、歩いておよそ13分、", to: "この後は、歩いておよそ18分、" },
  ],
  [BONSAI]: [
    { from: "埼玉県立歴史と民俗の博物館から歩いておよそ13分、", to: "埼玉県立歴史と民俗の博物館から歩いておよそ18分、" },
    { from: "近くには食事処もあるので、ここで昼食にしましょう。", to: "" },
    { from: "盆栽の奥深い世界をゆっくりと味わってみてください。", to: "盆栽の奥深い世界をゆっくりと味わいましょう。" },
    { from: "この後は、ニューシャトルなどで大宮駅方面へ戻り、あわせておよそ20分、鉄道博物館へ向かいましょう。", to: "この後は、歩いておよそ9分の土呂駅から、大宮駅で乗り換えて電車でおよそ14分の鉄道博物館駅へ。駅から歩いておよそ3分、鉄道博物館へ向かいましょう。" },
  ],
  [TETSU]: [
    { from: "大宮盆栽美術館から大宮駅方面へ戻り、あわせておよそ20分、", to: "大宮盆栽美術館から、電車と歩きであわせておよそ26分、" },
    { from: "鉄道の歴史と技術の奥深さを、たっぷりと感じてみてください。", to: "鉄道の歴史と技術の奥深さを、たっぷりと感じましょう。" },
    { from: "今夜はこの近くの宿でゆっくり休みましょう。", to: "この夜は、歩いておよそ29分の大宮駅のまわりの宿に泊まりましょう。" },
  ],
  [ONSEN]: [
    {
      from: "旅の2日目はさいたま清河寺温泉からスタートです。2日目は、大宮駅前などでレンタカーを借りて、車でめぐりましょう。",
      to: "2日目は車でめぐります。大宮駅のまわりの宿を出て、駅の近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ14分、さいたま清河寺温泉から始めます。",
    },
    { from: "旅の疲れを、ゆっくりと温泉でほぐしてみてください。", to: "旅の疲れを、ゆっくりと温泉でほぐしましょう。" },
    { from: "この後は、車でおよそ20分、三橋総合公園へ向かいましょう。", to: "この後は、車でおよそ10分、三橋総合公園へ向かいましょう。" },
  ],
  [MIHASHI]: [
    { from: "さいたま清河寺温泉から車でおよそ20分、", to: "さいたま清河寺温泉から車でおよそ10分、" },
    { from: "この後は、車でおよそ20分、秋ヶ瀬公園へ向かいましょう。", to: "この後は、車を公園にとめたまま、歩いておよそ7分、南口のまわりで昼食にしましょう。" },
  ],
  [AKI]: [
    { from: "三橋総合公園から車でおよそ20分、", to: "三橋総合公園の南口のまわりから歩いておよそ7分で車に戻り、車でおよそ20分、" },
    { from: "近くには食事処もあるので、ここで昼食にするのもおすすめです。", to: "" },
  ],
  [SAKURA]: [
    { from: "決められた場所から見学してください。", to: "決められた場所から見学しましょう。" },
    { from: "この後は、車でおよそ3分、荒川彩湖公園へ向かいましょう。", to: "この後は、車でおよそ12分、荒川彩湖公園へ向かいましょう。" },
  ],
  [SAIKO]: [
    { from: "桜草公園から車でおよそ3分、", to: "桜草公園から車でおよそ12分、" },
    { from: "川辺のひとときをゆっくりと過ごしてみてください。", to: "川辺のひとときをゆっくりと過ごしましょう。" },
    { from: "この後は、車でおよそ8分、別所沼公園へ向かいましょう。", to: "この後は、車でおよそ14分、別所沼公園へ向かいましょう。" },
  ],
  [BESSHO]: [
    { from: "荒川彩湖公園から車でおよそ8分、", to: "荒川彩湖公園から車でおよそ14分、" },
    { from: "のんびりと味わってみてください。", to: "のんびりと味わいましょう。" },
    { from: "この後は、車でおよそ3分、玉蔵院へ向かいましょう。", to: "この後は、車でおよそ9分、玉蔵院へ向かいましょう。" },
  ],
  [GYOKU]: [
    { from: "別所沼公園から車でおよそ3分、", to: "別所沼公園から車でおよそ9分、" },
    { from: "静かに、敬意をもってお参りください。", to: PRAY_TO },
    { from: "この後は、車でおよそ2分、調神社へ向かいましょう。", to: "この後は、車でおよそ8分、調神社へ向かいましょう。" },
  ],
  [TSUKI]: [
    { from: "玉蔵院から車でおよそ2分、", to: "玉蔵院から車でおよそ8分、" },
    { from: "静かに、敬意をもってお参りください。", to: PRAY_TO },
    { from: "お帰りは、駐車場に置いた車でご利用ください。", to: "見学を終えたら、車でおよそ17分の大宮駅でレンタカーを返しましょう（返す手続きに15分ほど）。" },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: KEYA, h: 10, m: 48, stay: 20, legs: [] },
  { id: HIKAWA, h: 11, m: 39, stay: 30, legs: [walk(8), { mode: "train", min: 3 }, walk(20)] },
  { id: PARK, h: 12, m: 10, stay: 20, legs: [walk(1)] },
  { id: ZOO, h: 12, m: 36, stay: 20, legs: [walk(6)] },
  { id: LUNCH1, h: 13, m: 10, stay: 50, legs: [walk(14)] },
  { id: MUSEUM, h: 14, m: 10, stay: 40, legs: [walk(10)] },
  { id: BONSAI, h: 15, m: 8, stay: 30, legs: [walk(18)] },
  { id: TETSU, h: 16, m: 4, stay: 50, legs: [walk(9), { mode: "train", min: 14 }, walk(3)] },
];
const DAY2: Plan = [
  { id: ONSEN, h: 9, m: 3, stay: 60, legs: [] },
  { id: MIHASHI, h: 10, m: 13, stay: 70, legs: [car(10)] },
  { id: LUNCH2, h: 11, m: 30, stay: 50, legs: [walk(7)] },
  { id: AKI, h: 12, m: 47, stay: 37, legs: [walk(7), car(20)] },
  { id: SAKURA, h: 13, m: 29, stay: 15, legs: [car(5)] },
  { id: SAIKO, h: 13, m: 56, stay: 30, legs: [car(12)] },
  { id: BESSHO, h: 14, m: 40, stay: 30, legs: [car(14)] },
  { id: GYOKU, h: 15, m: 19, stay: 25, legs: [car(9)] },
  { id: TSUKI, h: 15, m: 52, stay: 39, legs: [car(8)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [KEYA, HIKAWA, PARK, ZOO, MUSEUM, BONSAI, TETSU].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [ONSEN, MIHASHI, AKI, SAKURA, SAIKO, BESSHO, GYOKU, TSUKI].join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  const tetsuLegs = all.find((x) => x.id === TETSU)!.transitLegs;
  console.log(`盆栽→鉄道博物館のもとの移動: ${tetsuLegs.map((l) => `${l.transitMode}${l.transitDurationMin}(${l.transitLine ?? ""})`).join("+")}`);
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
  for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "すぐ、", "ホテル", "旅館"])
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

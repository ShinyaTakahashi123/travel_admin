/**
 * 初日・最終日の見直し #32 1d70017a「鳥羽湾めぐりと相差の海女文化、島めぐりと海女の里1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 20:3x、#32 は制作補助2。四季）
 * 歩きは routed-foot、車は routed-car（もとの値が ×1.5＋5 の内側ならそのまま、外れる区間・新しい区間は切り上げ＋5、歩きは切り上げ）
 * 定期船: 鳥羽市 時刻表（R8.4.1 改正）https://www.city.toba.mie.jp/material/files/group/45/teikisendaiya260401.pdf
 *   佐田浜 11:40 → 和具 11:58 → 答志 12:08（28分）／答志 13:45 → 和具 14:00 → 佐田浜 14:16（31分）
 *   答志の乗り場は OSM の航路「佐田浜 - 答志」way 1034962092 の端 34.530394,136.9034937 で測った
 * 1日目: 鳥羽駅 10:40ごろ → 歩8（559m）→ ミキモト真珠島 10:48（60→40）→ 歩12（879m）で鳥羽マリンターミナル＋定期船28＋歩4（297m）→
 *   【新】答志港のまわり（昼食）12:12〜12:52（OSM「鳥羽市役所答志連絡所」node 8206056955。観光三重 https://www.kankomie.or.jp/report/1636
 *   「マルト食堂は、答志港の定期船乗り場を出てすぐの場所にある飲食店で、丼ものや麺類、定食などを提供しています。」）→ 歩6（407m）→
 *   答志島（八幡神社）12:58（140→43。もとは和具。和具の物は住所が見つからず、企画運営 10/30 で答志の八幡神社 node 8206057336 に）→ 歩4（301m）＋定期船31 →
 *   乗りかえ5（定期船と湾めぐりは同じ鳥羽マリンターミナル。OSM の航路の端＝node 7930645765 で routed-foot は0のため、ターミナルの中の乗りかえとして5。観光三重 report/1405「鳥羽マリンターミナルでは一番奥にある船乗り場」。企画運営 10/30）→
 *   鳥羽湾めぐり（鳥羽マリンターミナル）14:21（60、もとのまま）→ 歩8（606m）→ 鳥羽一番街 15:29（65）→ 歩3（224m）→ 鳥羽マルシェ 16:37〜17:00（45→23）→ 歩8で鳥羽駅のまわりの宿
 *   外したもの: 鳥羽城跡（朝の行き先で、タイトル・説明文になく、点も案内板だけ。企画運営 10/30）
 *   湾めぐりの所要: 観光三重 https://www.kankomie.or.jp/report/176「15分ほどしてイルカ島に到着！」「40分ほど船にゆられながら…鳥羽マリンターミナルに到着！」（2016年の記事）
 * 2日目（16:35 に出るのはもとのまま）: 鳥羽駅のまわりの宿 → 駅の近くでレンタカー（手続き15分）＋車22（13.0km）→ 海の博物館 9:00（90）→ 車13（5.1km。もと7）→
 *   鳥羽展望台 10:43（40）→ 車17（7.3km）→ 相差（石神さん）11:40（50）→ 歩17（1,248m）→ 海女小屋はちまんかまど 12:47〜14:17（105→90。昼食をかねる。1か所の上限。企画運営 10/30）→
 *   歩17で石神さんのそばの車＋車8（1.0km）→ 千鳥ヶ浜海水浴場 14:42（30）→ 車43（32.2km）→【新】二見興玉神社 15:55〜16:35（企画運営 10/30 a）→ 車17（9.5km）で鳥羽駅、レンタカーを返す（15分）
 *   外したもの: 海士潜女神社（名前のある点がなく、OSM の名前のない神社 node 1385235394 は、観光三重の「鎧埼灯台（直線距離：344m）」と合わず別の神社と考えられる）・
 *   相差海女文化資料館（建物を確かめられない。石神さんのメモに一文 https://www.kankomie.or.jp/spot/16889）（企画運営 10/30 案1）
 * 点: ミキモト真珠島＝メモの「真珠博物館」Nominatim way 183562514（34.4837469,136.8468363）／鳥羽湾めぐり＝OSM「Toba Marine Terminal」ferry_terminal node 7930645765（いまは4けた）／
 *   答志島（八幡神社）＝OSM「八幡神社」node 8206057336／鳥羽一番街＝Nominatim way 183309104（いまは4けた）／
 *   相差（石神さん）＝OSM の名前のない神社 node 10125789093（religion=shinto。企画運営の1件ずつの例外 10/30。①公式の住所「相差町1385」の大字の中 ②地理院地図の鳥居の記号の位置
 *   https://maps.gsi.go.jp/#17/34.392077/136.904491/ ③まわり数百mにほかの神社の点がない。いまの点は「鳥羽警察署長岡駐在所」police node）／
 *   千鳥ヶ浜海水浴場＝beach_resort way 363538829 の頂点 node 3677074734（いまは浜の面の中）／二見興玉神社＝Nominatim relation 9591959（34.5083432,136.7888011）
 *   海の博物館（node 1420992984）・鳥羽展望台（way 713902690、Nominatim）・はちまんかまど（node 5846748285）・鳥羽マルシェ（node 4199980802）はいまの点のまま
 * 二見興玉神社の文: 観光三重 https://www.kankomie.or.jp/spot/2953
 * 答志島の文: 鳥羽市 https://www.city.toba.mie.jp/soshiki/chiiki/gyomu/rito_shinko/2019.html（3集落・漁業・神祭）、観光三重 report/1636（八幡神社の神紋）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-032-1d70017a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "1d70017a-edbf-4f1a-b92f-75a695b719ec";
const DAY1_ID = "f7670e73-f9d9-4cd4-abf7-3a67c6ba6851";
const DAY2_ID = "7f413a97-e949-4bf7-b64c-b95324d50002";
const JOSEKI = "587e1e0a-3b83-447e-bfe1-3392b5556018";
const WAN = "28f4036c-0d2b-469a-b5ad-757716231b66";
const SHINJU = "9c019c23-0564-45b2-8bfa-c32289cd46c7";
const TOSHI = "85d03089-d89c-4547-9439-5188985052f1";
const ICHIBAN = "15507f58-e090-4b8d-bce1-3f55a097a231";
const MARCHE = "0070ce7d-5445-40b8-9e40-395fb782203d";
const UMIHAKU = "ecdfbcb5-5f45-4f54-91e1-ecf0ce1df069";
const TENBO = "022dfbfd-8149-454b-90d2-612491f2357e";
const AMAKAZUKI = "b9a9c672-01d9-47d1-8d2c-6754fa61fd44";
const ISHIGAMI = "9fdeeb76-26d6-4cbc-bc66-8f8930808f88";
const SHIRYO = "e9c56093-e227-4551-a695-0de3c69369e8";
const CHIDORI = "aabeaeac-0f56-4360-bf23-65d9e7be446b";
const KAMADO = "f49d13ab-b659-4993-ac48-c6b03b63845d";
const LUNCH1 = "new-toshi-lunch";
const FUTAMI = "new-futami";
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
  [SHINJU]: { from: [34.483394, 136.846888], to: [34.4837469, 136.8468363] },
  [WAN]: { from: [34.4853, 136.8442], to: [34.490089, 136.8455416] },
  [TOSHI]: { from: [34.522743, 136.89898], to: [34.5291606, 136.9048418] },
  [ICHIBAN]: { from: [34.4873, 136.8439], to: [34.4872901, 136.8438886] },
  [ISHIGAMI]: { from: [34.391123, 136.907514], to: [34.392077, 136.904491] },
  [CHIDORI]: { from: [34.395892, 136.908989], to: [34.393874, 136.9088814] },
};
const RENAME: Record<string, string> = { [TOSHI]: "答志島（八幡神社）", [WAN]: "鳥羽湾めぐり（鳥羽マリンターミナル）" };

const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const NEW: Record<string, { name: string; lat: number; lng: number; address: string; memo: string }> = {
  [LUNCH1]: {
    name: "答志港のまわり（昼食）",
    lat: 34.5290501,
    lng: 136.9016205,
    address: "三重県鳥羽市答志町",
    memo: "ミキモト真珠島から歩いて約12分の鳥羽マリンターミナルから、定期船でおよそ28分、答志島の答志港に着きます。港から歩いて約4分。答志港の定期船乗り場のそばには、丼ものや麺類、定食を出す食堂もあるので、ここで昼食をとりましょう。定期船の時刻は、鳥羽市の時刻表で確かめましょう。食事を終えたら、歩いて約6分、八幡神社へ向かいましょう。",
  },
  [FUTAMI]: {
    name: "二見興玉神社",
    lat: 34.5083432,
    lng: 136.7888011,
    address: "三重県伊勢市二見町江575",
    memo: "千鳥ヶ浜から車でおよそ43分。猿田彦大神を祀る神社で、正面に見える夫婦岩は、沖合およそ700ｍ先に鎮まる猿田彦大神ゆかりの霊石「興玉神石」と、日の大神を遙拝するための鳥居とみなされています。古くから、神宮へお参りする前に二見浦の海水で心身を清める「浜参宮」という習わしがあります。境内には、猿田彦大神のお使いとされる二見蛙が多数奉納されています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。鳥羽の海と、そこに生きる人々の祈りにふれた1泊2日の旅を、ここで締めくくりましょう。見学を終えたら、車でおよそ17分の鳥羽駅でレンタカーを返しましょう（返す手続きに15分ほど）。",
  },
};

const MEMO_SET: Record<string, string> = {
  [TOSHI]:
    "答志港のまわりから歩いて約6分、答志の集落にある八幡神社に着きます。答志島は鳥羽港の北東にある鳥羽市でいちばん大きな島で、答志・答志和具・桃取の3つの集落があり、漁業がさかんです。八幡神社の神紋は、大漁や家内安全を祈る意味があるとされ、毎年旧暦の1月17日から19日には、八幡神社の祭礼「神祭」が行われます。道幅の狭い路地を歩きながら、漁師町の暮らしを感じましょう。" +
    PRAY_TO +
    "この後は、歩いて約4分の答志港から定期船でおよそ31分、佐田浜の鳥羽マリンターミナルへ戻りましょう。",
  [WAN]:
    "答志島から定期船で佐田浜の鳥羽マリンターミナルに戻ったら、ターミナルの一番奥にある乗り場から、鳥羽湾めぐりの遊覧船に乗りましょう（答志の八幡神社から、歩きと船と乗りかえであわせておよそ40分）。イルカ島まではおよそ15分、そこから鳥羽マリンターミナルまでは40分ほど船にゆられながら、鳥羽湾をめぐります。船上からは、リアス海岸ならではの入り組んだ海岸線や、波の穏やかな湾内の景色を眺めることができます。運航の時刻は季節で変わり、冬には運休する期間もあるので、公式の案内で確かめましょう。海の上から鳥羽の街並みや島々を眺めながら、のんびりとした船旅を楽しみましょう。この後は、歩いて約8分、鳥羽一番街へ向かいましょう。",
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [SHINJU]: [
    { from: "佐田浜から歩いておよそ5分、鳥羽湾に浮かぶミキモト真珠島に着きます。", to: "鳥羽駅に10時40分ごろ着いたら、歩いておよそ8分、鳥羽湾に浮かぶミキモト真珠島から旅を始めます。" },
    { from: "もうひとつの海女文化にも触れてみてください。", to: "もうひとつの海女文化にも触れましょう。" },
    { from: "この後は佐田浜へ戻り、定期船で答志島へ向かいましょう。", to: "この後は、歩いておよそ12分の佐田浜の鳥羽マリンターミナルから、定期船で答志島の答志港へ向かいましょう。" },
  ],
  [ICHIBAN]: [
    { from: "定期船で佐田浜に戻ったら、歩いてすぐの鳥羽一番街へ向かいましょう。", to: "鳥羽マリンターミナルから歩いて約8分、鳥羽一番街に着きます。" },
    { from: "午前中に遊覧船で巡った鳥羽湾を", to: "遊覧船で巡った鳥羽湾を" },
    { from: "お腹を満たし、旅の思い出になる品を選んだら、最後にもう一か所、鳥羽マルシェへ立ち寄りましょう。", to: "旅の思い出になる品を選んだら、歩いて約3分、鳥羽マルシェへ向かいましょう。" },
  ],
  [MARCHE]: [
    { from: "鳥羽一番街のすぐそばにある鳥羽マルシェが、1日目最後の目的地です。", to: "鳥羽一番街から歩いて約3分の鳥羽マルシェが、1日目最後の目的地です。" },
    { from: "鳥羽ならではのお土産探しの締めくくりにおすすめの場所です。", to: "鳥羽ならではのお土産探しにも向いた場所です。" },
    { from: "1日を通して鳥羽の海の恵みと人々の暮らしに触れる旅になりました。", to: "1日を通して鳥羽の海の恵みと人々の暮らしに触れる旅になりました。見学を終えたら、この夜は、歩いて約8分の鳥羽駅のまわりの宿に泊まりましょう。" },
  ],
  [UMIHAKU]: [
    {
      from: "2日目はレンタカーで、鳥羽から少し足を延ばして、浦村町にある鳥羽市立海の博物館から始めます。",
      to: "2日目は車でめぐります。鳥羽駅のまわりの宿を出て、駅の近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ22分、浦村町にある鳥羽市立海の博物館から始めます。",
    },
    { from: "興味があれば訪れる前に確かめてみてください。", to: "興味があれば訪れる前に確かめましょう。" },
    { from: "この後は車で、パールロード沿いの鳥羽展望台へ向かいましょう。", to: "この後は車でおよそ13分、パールロード沿いの鳥羽展望台へ向かいましょう。" },
  ],
  [TENBO]: [
    { from: "海の博物館から車でおよそ7分、", to: "海の博物館から車でおよそ13分、" },
    { from: "この後は、海女文化ゆかりの神社、海士潜女神社へ向かいましょう。", to: "この後は、車でおよそ17分、海女文化が息づく相差の石神さんへ向かいましょう。" },
  ],
  [ISHIGAMI]: [
    { from: "海士潜女神社から車でおよそ10分、", to: "鳥羽展望台から車でおよそ17分、" },
    {
      from: "参拝の際は、静かに、敬意をもって、願いごとをひとつだけに絞り、心を込めてお祈りしてみてください。この後は、歩いてすぐの相差海女文化資料館へ向かいましょう。",
      to:
        PRAY_TO +
        "願いごとはひとつだけに絞り、心を込めてお祈りしましょう。相差には、海女が昔使っていた道具や磯着を展示する相差海女文化資料館もあります。この後は、車をとめたまま、歩いておよそ17分、海女小屋はちまんかまどへ向かいましょう。",
    },
  ],
  [KAMADO]: [
    {
      from: "千鳥ヶ浜から歩いておよそ19分、浅茅浜と海を望む高台にある海女小屋はちまんかまどが、旅の最後の目的地です。",
      to: "相差の石神さんから歩いておよそ17分、浅茅浜と海を望む高台にある海女小屋はちまんかまどに着きます。",
    },
    { from: "炭火焼きにして味わえる体験施設です。", to: "炭火焼きにして味わえる体験施設なので、ここで昼食をかねましょう。" },
    {
      from: "鳥羽の海と、そこに生きる女性たちの文化にたっぷり触れた1泊2日の旅を、ここで締めくくってください。",
      to: "体験を終えたら、歩いておよそ17分で石神さんのそばにとめた車に戻り、車でおよそ8分、千鳥ヶ浜へ向かいましょう。",
    },
  ],
  [CHIDORI]: [
    { from: "相差海女文化資料館から歩いておよそ8分、", to: "海女小屋はちまんかまどから、歩きと車であわせておよそ25分、" },
    { from: "無理をしないようにしてください。相差の集落を歩いてきた足を止めて、しばらく海辺の空気を楽しんでください。", to: "無理をしないようにしましょう。しばらく海辺の空気を楽しみましょう。" },
    { from: "この後は、海沿いを歩いて海女小屋はちまんかまどへ向かいましょう。", to: "この後は、車でおよそ43分、伊勢市の二見興玉神社へ向かいましょう。" },
  ],
};

const DESC_FROM = "遊覧船で答志島などを巡る鳥羽湾めぐりと、";
const DESC_TO = "遊覧船での鳥羽湾めぐりと、定期船で渡る答志島、";

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: SHINJU, h: 10, m: 48, stay: 40, legs: [] },
  { id: LUNCH1, h: 12, m: 12, stay: 40, legs: [walk(12), other(28, "定期船"), walk(4)] },
  { id: TOSHI, h: 12, m: 58, stay: 43, legs: [walk(6)] },
  { id: WAN, h: 14, m: 21, stay: 60, legs: [walk(4), other(31, "定期船"), other(5, "ターミナルの中の乗りかえ")] },
  { id: ICHIBAN, h: 15, m: 29, stay: 65, legs: [walk(8)] },
  { id: MARCHE, h: 16, m: 37, stay: 23, legs: [walk(3)] },
];
const DAY2: Plan = [
  { id: UMIHAKU, h: 9, m: 0, stay: 90, legs: [] },
  { id: TENBO, h: 10, m: 43, stay: 40, legs: [car(13)] },
  { id: ISHIGAMI, h: 11, m: 40, stay: 50, legs: [car(17)] },
  { id: KAMADO, h: 12, m: 47, stay: 90, legs: [walk(17)] },
  { id: CHIDORI, h: 14, m: 42, stay: 30, legs: [walk(17), car(8)] },
  { id: FUTAMI, h: 15, m: 55, stay: 40, legs: [car(43)] },
];
const REMOVE1 = [JOSEKI];
const REMOVE2 = [AMAKAZUKI, SHIRYO];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [JOSEKI, WAN, SHINJU, TOSHI, ICHIBAN, MARCHE].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [UMIHAKU, TENBO, AMAKAZUKI, ISHIGAMI, SHIRYO, CHIDORI, KAMADO].join()) throw new Error("2日目の構成が想定と違います");
  if ((it.description ?? "").split(DESC_FROM).length !== 2) throw new Error("説明文の置き換え元が見つかりません");
  const description = (it.description ?? "").replace(DESC_FROM, DESC_TO);
  const all = [...d1.spots, ...d2.spots];
  for (const [id, c] of Object.entries(COORDS)) {
    const s = all.find((x) => x.id === id)!;
    if (Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${s.name}: いまの座標が想定と違います（${s.lat},${s.lng}）`);
  }
  const memos: Record<string, string> = { ...MEMO_SET };
  for (const [id, edits] of Object.entries(MEMO_EDITS)) {
    const s = all.find((x) => x.id === id)!;
    let m = s.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${s.name}: 置き換え元が見つかりません: ${e.from.slice(0, 24)}`);
      m = m.replace(e.from, e.to);
    }
    memos[id] = m;
  }
  console.log(`説明文: ${description}`);
  for (const id of [...REMOVE1, ...REMOVE2]) console.log(`外す: ${all.find((x) => x.id === id)!.name}`);
  for (const [id, n] of Object.entries(NEW)) all.push({ ...n, id, visitTime: null, stayDurationMin: null, transitLegs: [] } as never);
  for (const n of Object.values(NEW)) console.log(`新しいスポット: ${n.name}（${n.lat},${n.lng}）\n  ${n.memo}`);
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? NEW[p.id]?.memo ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "すぐ", "ホテル", "旅館", "締めくくり", "鳥羽城", "海士潜女", "和具", "胴塚"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」があります`));
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const show = (label: string, plan: Plan) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = all.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${RENAME[p.id] ?? s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分 ${s.transitLegs.map((l) => l.transitMode + l.transitDurationMin).join("+") || "-"}）${s.stayDurationMin != null && p.stay > s.stayDurationMin ? " ⚠滞在がもとより長い" : ""}`);
      if (COORDS[p.id]) console.log(`  座標 ${COORDS[p.id].from.join(",")} → ${COORDS[p.id].to.join(",")}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", DAY1);
  show("2日目（直したあと）", DAY2);
  console.log("\n直したメモ:");
  for (const [id, m] of Object.entries(memos)) console.log(`■ ${RENAME[id] ?? all.find((x) => x.id === id)!.name}\n${m}`);
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
              ...(RENAME[p.id] ? { name: RENAME[p.id] } : {}),
              ...(COORDS[p.id] ? { lat: COORDS[p.id].to[0], lng: COORDS[p.id].to[1] } : {}),
            },
          }
    );
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx, remove: REMOVE1 });
      await setDaySpotOrder(DAY2_ID, items(DAY2) as never, { tx, remove: REMOVE2 });
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

/**
 * 初日・最終日の見直し #42 1621a020「岩瀬家と五箇山和紙の里、合掌造りと伝統工芸にふれる1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30 18:38、#37〜#44 は制作補助2）
 * 歩きは routed-foot、車は routed-car（もとの値が ×1.5＋5 の内側ならそのまま、外れる区間・新しい区間は切り上げ＋5、歩きは切り上げ）
 * 入口: 東海北陸自動車道 五箇山IC（地理院の地名「五箇山ＩＣ」36.3929337,136.8795154）。もとは城端の町から 8:30 に始まる形（帰りは白川郷ICから高速道路なので、車で来る旅）
 * 1日目: 五箇山IC 10:45ごろ → 車15（11.9km）で相倉の駐車場（OSM「相倉合掌集落駐車場入口」node 4249962726）＋歩8（559m）→ 相倉合掌造り集落 11:08（40→30）→
 *   歩3（108m、もとのまま）→ 相倉民俗館 11:41（30→25）→ 歩4（267m）→【新】相倉のまわり 12:10〜12:50（昼食。OSM「相倉国民休養地広場」node 4249962696。
 *   国交省 多言語DB https://www.mlit.go.jp/tagengo-db/common/001553140.pdf「現在、これら合掌造り家屋には…レストラン、博物館、店舗、観光客向けの宿泊施設に変わっているものもあります。」）→
 *   歩6（400m）で駐車場の車＋車4（5.1km、もとのまま）→ 村上家 13:00（35→30）→ 歩2（113m。もとは車5）→ 白山宮 13:32（30→20）→ 歩5（332m。もとは車3）→ 流刑小屋 13:57（30→15）→
 *   歩3（218m）で村上家のそばの車＋車10（8.5km、もとのまま）→ 五箇山和紙の里 14:25（120→90。もとは併設の食事処で 13:50〜 の昼食）→ 車4（2.7km、もとのまま）→
 *   新五箇山温泉 ゆ～楽 15:59〜16:59（60）→ 車14（10.6km）で上梨のまわりの宿（OSM で上梨に「五箇山荘」building=hotel・「合掌民宿 弥次兵衛」。宿の名前は書かない）
 *   外したもの: 城端別院善徳寺（8:30）・城端曳山会館（9:02）（朝の行き先で、タイトル・説明文になく、2日目にも入らない）・相倉伝統産業館（OSM に点がなく、内容は2日目の塩硝の館・五箇山民俗館と重なる）
 * 2日目（16:40 に出るのはもとのまま。企画運営 10/30: 7分を行徳寺に戻す）: 上梨のまわりの宿 → 車9（4.9km）で菅沼の駐車場（OSM「合掌の里駐車場」node 4249962695）＋歩4（232m）→ 菅沼合掌造り集落 9:00（35）→
 *   歩3（もとのまま）→ 五箇山民俗館 9:38（35→30）→ 歩2（もとのまま）→ 塩硝の館 10:10（35→25）→ 歩2で駐車場の車＋車6（3.3km、もとのまま）→ 岩瀬家 10:43（60→45。もとは「このあたりで昼食」）→
 *   車5（1.2km、もとのまま）→ 行徳寺 11:33（30→27）→ 車21（17.4km。もと14）でせせらぎ公園の駐車場（OSM「せせらぎ公園Ｐ」way 236408808）＋歩4（279m）→
 *   【新】であい橋のまわり 12:25〜13:05（昼食。OSM「であい橋」way 26828141 の東の端 node 294462102。橋の東の荻町の集落に OSM の食事処「手打ちそば処 乃むら」way 586010780・
 *   「いっぷく ちな」way 236248638 など）→ 歩6（407m）→ 野外博物館合掌造り民家園 13:11〜14:12（75→61。冬は 9:00〜16:00 https://www.kankou-gifu.jp/spot/detail_1207.html なので、もとの 14:40〜15:55 より前に）→
 *   歩9（650m）→ 明善寺 14:21（30→25）→ 歩8（540m）→ 和田家 14:54（30）→ 歩5（335m）→ 白川郷荻町合掌造り集落 15:29（35）→ 歩11（814m）→ 天守閣展望台 16:15〜16:40（25）→
 *   歩18（1,339m）でせせらぎ公園の駐車場＋車9（2.4km）で白川郷IC（地理院の値 36.270939,136.898575）
 * 点: 相倉合掌造り集落＝OSM「越中五箇山相倉集落」tourism=attraction node 4485300889（いまは place node「相倉」）／相倉民俗館＝OSM「南砺市立相倉民俗館」node 1420913963（いまは集落と同じ place node）／
 *   村上家＝OSM「民俗資料館村上家」way 1342700012 の頂点 node 12422962004（バス停「上梨」に近い角。いまは約1km北西の点）／五箇山和紙の里＝メモの「たいら郷土館」OSM node 1420913085（いまは place node「東中江」）／
 *   菅沼合掌造り集落＝OSM「越中五箇山菅沼集落」tourism=attraction node 4551744289（いまは place node「菅沼」）／五箇山民俗館＝OSM「南砺市立五箇山民俗館」node 1420913955／塩硝の館＝OSM「南砺市立塩硝の館」node 1420913961
 *   （どちらもいまは菅沼の place node）／岩瀬家＝OSM node 10948121105（name:en=Iwase Residence, tourism=museum。いまは約100m南）／行徳寺＝OSM node 10948122905（wikipedia=ja:行徳寺。いまは大字「西赤尾町」の中心で約1.7km西）
 *   明善寺＝Nominatim way 1260591574（36.2559101,136.9065906）／民家園＝Nominatim way 662319019（name:en=Gasshozukuri Minkaen Outdoor Museum。36.2550209,136.9015303）（法務 10/30 20:08）
 *   白山宮（way 1342700013）・流刑小屋（way 1342700022）・ゆ～楽（way 700608705）・和田家（way 236248621）は Nominatim の値を6けたにしたいまの点のまま。
 *   天守閣展望台（node 3752300847）・荻町（historic=unesco_world_heritage「白川郷」node 683765481）も node の値と同じなのでそのまま
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-042-1621a020.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "1621a020-b8f3-41ff-bb67-270b99f0782d";
const DAY1_ID = "c9bcca21-0b20-4714-a6eb-acf09158ab7d";
const DAY2_ID = "85bec888-3775-474a-a81f-f41e3bf0f0e7";
const ZENTOKU = "e58e76b9-760f-4b3b-97fa-39cba0bfbd1e";
const HIKIYAMA = "d1dea107-0a17-4984-8609-60591c31341a";
const AINOKURA = "5180d5bb-2cc0-494f-8c01-3ff1c8bd4a59";
const AI_MINZOKU = "ea6b8c6f-301d-4c6b-bae9-5c081130d7f7";
const AI_SANGYO = "885aea12-01b6-43d2-82de-e0fa0b1c38e2";
const MURAKAMI = "2a21313a-a48c-4c1f-af68-872aa0601167";
const HAKUSAN = "4b2453bb-1890-4895-8260-89d6f890d6c6";
const RUKEI = "45e6e8d9-23e6-457d-b745-7fa64300464d";
const WASHI = "8d1cead2-cb8d-4aec-af22-16e9d51dab3d";
const YURAKU = "ffb07e91-25b0-46e2-b71c-0b5e7a831a6d";
const SUGANUMA = "a24dc82a-de3a-40a8-8feb-ba6386cc5e09";
const GO_MINZOKU = "cd83508a-d202-4a62-b1f1-d8e1b2fae8f1";
const ENSHO = "aeb77101-e9e5-4816-a623-c0f5dc707ae2";
const IWASE = "dbf5cc44-3ba1-4f69-9e50-01273f0c0ae8";
const GYOTOKU = "0ee74b01-ba4e-4155-a6ac-f1811a6ed337";
const OGI = "e7e285ec-33b3-45aa-82a1-ba38226e7c85";
const WADA = "b654e334-4caa-4129-9fed-4f28edf26d23";
const MYOZEN = "0dbc877a-025a-4873-a676-eebf91862101";
const MINKAEN = "11da6ece-6f64-407a-9f03-79c0f8a251ae";
const TENSHU = "19955d06-9891-4fb9-bd45-936c4a48b554";
const LUNCH1 = "new-ainokura";
const LUNCH2 = "new-deaibashi";
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
  [AINOKURA]: { from: [36.430688, 136.914051], to: [36.426177, 136.9355622] },
  [AI_MINZOKU]: { from: [36.430688, 136.914051], to: [36.425285, 136.935077] },
  [MURAKAMI]: { from: [36.419926, 136.912506], to: [36.4105526, 136.9311104] },
  [WASHI]: { from: [36.444843, 136.971634], to: [36.445563, 136.975154] },
  [SUGANUMA]: { from: [36.399578, 136.886871], to: [36.4051867, 136.8860765] },
  [GO_MINZOKU]: { from: [36.399578, 136.886871], to: [36.404476, 136.886852] },
  [ENSHO]: { from: [36.399578, 136.886871], to: [36.4041163, 136.8869617] },
  [IWASE]: { from: [36.381125, 136.870625], to: [36.3819743, 136.8702611] },
  [GYOTOKU]: { from: [36.383419, 136.851166], to: [36.3802895, 136.8700011] },
  [MYOZEN]: { from: [36.256043, 136.9066], to: [36.2559101, 136.9065906] },
  [MINKAEN]: { from: [36.255041, 136.901127], to: [36.2550209, 136.9015303] },
};

const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const NEW: Record<string, { name: string; lat: number; lng: number; address: string; memo: string }> = {
  [LUNCH1]: {
    name: "相倉のまわり（昼食）",
    lat: 36.4273911,
    lng: 136.9365106,
    address: "富山県南砺市相倉",
    memo: "相倉民俗館から歩いておよそ4分。相倉の集落には、合掌造りの家を生かした食事処などもあるので、ここで昼食をとりましょう。食事を終えたら、歩いておよそ6分で駐車場にとめた車に戻り、車でおよそ4分、上梨の村上家へ向かいましょう。",
  },
  [LUNCH2]: {
    name: "であい橋のまわり（昼食）",
    lat: 36.256549,
    lng: 136.904409,
    address: "岐阜県大野郡白川村荻町",
    memo: "行徳寺から、車と歩きであわせておよそ25分。高速道路で岐阜県に入り、せせらぎ公園の駐車場に車をとめて、庄川にかかるであい橋へ向かいます。橋をわたった荻町の集落には、そば処などの食事処もあるので、ここで昼食をとりましょう。食事を終えたら、歩いておよそ6分、野外博物館合掌造り民家園へ向かいましょう。",
  },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [AINOKURA]: [
    {
      from: "城端曳山会館から車でおよそ30分、世界遺産・相倉合掌造り集落に着きます。",
      to: "東海北陸自動車道の五箇山ICに10時45分ごろ着いたら、車でおよそ15分の相倉の駐車場に車をとめ、歩いておよそ8分、世界遺産・相倉合掌造り集落に着きます。",
    },
    { from: "朝のやわらかな光の中、坂を上り下りしながら、五箇山の原風景をゆっくりと味わってみてください。", to: "坂を上り下りしながら、五箇山の原風景をゆっくりと味わいましょう。" },
    { from: "この後は、歩いてすぐ、相倉民俗館へ向かいましょう。", to: "この後は、歩いておよそ3分、相倉民俗館へ向かいましょう。" },
  ],
  [AI_MINZOKU]: [
    { from: "相倉合掌造り集落から歩いてすぐ、", to: "相倉合掌造り集落から歩いておよそ3分、" },
    { from: "これから訪れる建物の暮らしぶりを具体的にイメージしてみてください。", to: "これから訪れる建物の暮らしぶりを、具体的に思い浮かべましょう。" },
    { from: "この後は、歩いてすぐ、相倉伝統産業館へ向かいましょう。", to: "この後は、歩いておよそ4分、相倉のまわりで昼食にしましょう。" },
  ],
  [MURAKAMI]: [
    { from: "相倉伝統産業館から車でおよそ4分、", to: "相倉のまわりから、歩きと車であわせておよそ10分、" },
    { from: "五箇山の暮らしの奥深さに触れてみてください。", to: "五箇山の暮らしの奥深さに触れましょう。" },
    { from: "この後は、車でおよそ5分、白山宮へ向かいましょう。", to: "この後は、車をとめたまま、歩いておよそ2分、白山宮へ向かいましょう。" },
  ],
  [HAKUSAN]: [
    { from: "村上家から車でおよそ5分、", to: "村上家から歩いておよそ2分、" },
    { from: "静かに、敬意をもってお参りください。", to: PRAY_TO },
    { from: "この後は、車でおよそ3分、田向の流刑小屋へ向かいましょう。", to: "この後は、歩いておよそ5分、田向の流刑小屋へ向かいましょう。" },
  ],
  [RUKEI]: [
    { from: "白山宮から車でおよそ3分、", to: "白山宮から歩いておよそ5分、" },
    { from: "もう一つの歴史に触れてみてください。", to: "もう一つの歴史に触れましょう。" },
    { from: "この後は、車でおよそ10分、五箇山和紙の里へ向かいましょう。", to: "この後は、歩いておよそ3分で村上家のそばにとめた車に戻り、車でおよそ10分、五箇山和紙の里へ向かいましょう。" },
  ],
  [WASHI]: [
    { from: "流刑小屋から車でおよそ10分、", to: "流刑小屋から、歩きと車であわせておよそ13分、" },
    { from: "併設の食事処もあるので、ここで昼食にしましょう。", to: "" },
    { from: "時間をかけて、3つの施設をじっくりとめぐってみてください。", to: "3つの施設を、じっくりとめぐりましょう。" },
  ],
  [YURAKU]: [
    { from: "訪れる前に、公式サイトで営業時間や休館日を確かめてください。", to: "訪れる前に、公式サイトで営業時間や休館日を確かめましょう。" },
    {
      from: "城端の町並みから相倉・上梨の合掌造り集落、五箇山和紙の里まで巡った1日目は、ここで締めくくりましょう。今夜はこの近くの宿でゆっくり休みましょう。",
      to: "相倉・上梨の合掌造り集落から五箇山和紙の里まで巡った1日目も、ここで終わりです。見学を終えたら、この夜は、車でおよそ14分の上梨のまわりの宿に泊まりましょう。",
    },
  ],
  [SUGANUMA]: [
    {
      from: "旅の2日目は、宿から南下し、世界遺産・菅沼合掌造り集落から始めます。",
      to: "2日目は、上梨のまわりの宿を出て、車でおよそ9分の菅沼の駐車場に車をとめ、歩いておよそ4分、世界遺産・菅沼合掌造り集落から始めます。",
    },
    { from: "この後は、集落内にある五箇山民俗館へ向かいましょう。", to: "この後は、歩いておよそ3分、集落の中にある五箇山民俗館へ向かいましょう。" },
  ],
  [GO_MINZOKU]: [
    { from: "菅沼合掌造り集落から歩いてすぐ、", to: "菅沼合掌造り集落から歩いておよそ3分、" },
    { from: "この後は、歩いてすぐ、塩硝の館へ向かいましょう。", to: "この後は、歩いておよそ2分、塩硝の館へ向かいましょう。" },
  ],
  [ENSHO]: [
    { from: "五箇山民俗館から歩いてすぐ、", to: "五箇山民俗館から歩いておよそ2分、" },
    { from: "この後は、車でおよそ6分、西赤尾の岩瀬家へ向かいましょう。", to: "この後は、歩いておよそ2分で駐車場の車に戻り、車でおよそ6分、西赤尾の岩瀬家へ向かいましょう。" },
  ],
  [IWASE]: [
    { from: "塩硝の館から車でおよそ6分、", to: "塩硝の館から、歩きと車であわせておよそ8分、" },
    { from: "このあたりで、昼食にしましょう。", to: "" },
    { from: "山あいの暮らしの知恵と歴史に、ぜひ思いを馳せてみてください。", to: "山あいの暮らしの知恵と歴史に、思いを馳せましょう。" },
  ],
  [GYOTOKU]: [
    { from: "静かに、敬意をもって拝観し、山深い五箇山に根づいた信仰の歴史を感じてみてください。", to: "山深い五箇山に根づいた信仰の歴史を感じましょう。" + PRAY_TO },
    {
      from: "この後は、車でおよそ14分、高速道路を使って岐阜県の白川郷へ向かいましょう。",
      to: "この後は、高速道路を使って車でおよそ21分、岐阜県の白川郷のせせらぎ公園の駐車場へ向かい、歩いておよそ4分、であい橋のまわりで昼食にしましょう。",
    },
  ],
  [MINKAEN]: [
    { from: "明善寺から歩いておよそ8分、庄川を渡った西側にある", to: "であい橋のまわりから歩いておよそ6分、庄川を渡った西側にある" },
    { from: "冬季(12月〜2月)は営業時間が短くなるので、訪れる前に公式サイトで確かめてください。", to: "冬（12月〜2月）は開いている時間が短くなるので、訪れる前に公式サイトで確かめましょう。" },
    { from: "この後は、坂道を上っておよそ20分(シャトルバスも利用できます)、天守閣展望台へ向かいましょう。", to: "この後は、歩いておよそ9分、明善寺へ向かいましょう。" },
  ],
  [MYOZEN]: [
    { from: "和田家から歩いておよそ7分、", to: "野外博物館合掌造り民家園から歩いておよそ9分、" },
    { from: "静かに、敬意をもってお参りください。", to: PRAY_TO },
    { from: "この後は、歩いておよそ8分、野外博物館合掌造り民家園へ向かいましょう。", to: "この後は、歩いておよそ8分、和田家へ向かいましょう。" },
  ],
  [WADA]: [
    { from: "荻町集落から歩いておよそ5分、", to: "明善寺から歩いておよそ8分、" },
    { from: "この後は、歩いておよそ7分、明善寺へ向かいましょう。", to: "この後は、歩いておよそ5分、荻町集落の中ほどへ向かいましょう。" },
  ],
  [OGI]: [
    { from: "行徳寺から車でおよそ14分、高速道路を使って岐阜県に入り、白川郷の荻町集落に着きます。", to: "和田家から歩いておよそ5分、白川郷の荻町集落の中ほどに着きます。" },
    { from: "ゆっくりと歩いて味わってみてください。", to: "ゆっくりと歩いて味わいましょう。" },
    { from: "この後は、歩いておよそ5分、和田家へ向かいましょう。", to: "この後は、坂道を上っておよそ11分（シャトルバスもあります）、天守閣展望台へ向かいましょう。" },
  ],
  [TENSHU]: [
    { from: "野外博物館合掌造り民家園から、坂道を上っておよそ20分(シャトルバスも利用できます)、", to: "荻町集落の中ほどから、坂道を上っておよそ11分（シャトルバスもあります）、" },
    { from: "高いところからゆっくりと眺めてみてください。", to: "高いところからゆっくりと眺めましょう。" },
    { from: "お帰りは、白川郷ICから高速道路をご利用ください。", to: "見学を終えたら、歩いておよそ18分でせせらぎ公園の駐車場に戻り、車でおよそ9分の白川郷ICから帰りましょう。" },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: AINOKURA, h: 11, m: 8, stay: 30, legs: [] },
  { id: AI_MINZOKU, h: 11, m: 41, stay: 25, legs: [walk(3)] },
  { id: LUNCH1, h: 12, m: 10, stay: 40, legs: [walk(4)] },
  { id: MURAKAMI, h: 13, m: 0, stay: 30, legs: [walk(6), car(4)] },
  { id: HAKUSAN, h: 13, m: 32, stay: 20, legs: [walk(2)] },
  { id: RUKEI, h: 13, m: 57, stay: 15, legs: [walk(5)] },
  { id: WASHI, h: 14, m: 25, stay: 90, legs: [walk(3), car(10)] },
  { id: YURAKU, h: 15, m: 59, stay: 60, legs: [car(4)] },
];
const DAY2: Plan = [
  { id: SUGANUMA, h: 9, m: 0, stay: 35, legs: [] },
  { id: GO_MINZOKU, h: 9, m: 38, stay: 30, legs: [walk(3)] },
  { id: ENSHO, h: 10, m: 10, stay: 25, legs: [walk(2)] },
  { id: IWASE, h: 10, m: 43, stay: 45, legs: [walk(2), car(6)] },
  { id: GYOTOKU, h: 11, m: 33, stay: 27, legs: [car(5)] },
  { id: LUNCH2, h: 12, m: 25, stay: 40, legs: [car(21), walk(4)] },
  { id: MINKAEN, h: 13, m: 11, stay: 61, legs: [walk(6)] },
  { id: MYOZEN, h: 14, m: 21, stay: 25, legs: [walk(9)] },
  { id: WADA, h: 14, m: 54, stay: 30, legs: [walk(8)] },
  { id: OGI, h: 15, m: 29, stay: 35, legs: [walk(5)] },
  { id: TENSHU, h: 16, m: 15, stay: 25, legs: [walk(11)] },
];
const REMOVE1 = [ZENTOKU, HIKIYAMA, AI_SANGYO];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [ZENTOKU, HIKIYAMA, AINOKURA, AI_MINZOKU, AI_SANGYO, MURAKAMI, HAKUSAN, RUKEI, WASHI, YURAKU].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [SUGANUMA, GO_MINZOKU, ENSHO, IWASE, GYOTOKU, OGI, WADA, MYOZEN, MINKAEN, TENSHU].join()) throw new Error("2日目の構成が想定と違います");
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
  for (const id of REMOVE1) console.log(`外す: ${all.find((x) => x.id === id)!.name}`);
  for (const [id, n] of Object.entries(NEW)) all.push({ ...n, id, visitTime: null, stayDurationMin: null, transitLegs: [] } as never);
  for (const n of Object.values(NEW)) console.log(`新しいスポット: ${n.name}（${n.lat},${n.lng}）\n  ${n.memo}`);
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? NEW[p.id]?.memo ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "てみ", "すぐ", "ホテル", "旅館", "締めくくり", "城端", "伝統産業館", "朝"])
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

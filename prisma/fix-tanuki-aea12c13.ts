/**
 * 田貫湖の逆さ富士、湖面に映る絶景を楽しむ静岡富士山プラン(aea12c13)の組み直し(2026-11-05、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の aea12c13 の欄(組み直しが要るしおり)。11/05 0時に制作から制作補助2へ移った分。
 * - まかいの牧場は会社が営む体験施設なので6章で外す。069ec35c(日帰り)・66d185f1(1泊2日)と4か所ずつ重なるため、陣馬の滝・白糸の滝・
 *   富士山本宮浅間大社・富士山世界遺産センターも外し、題の中心の田貫湖のほかは、ほかの2本にない公的な場所で組む(企画運営 11/05)。
 *   人穴富士講遺跡は 66d185f1 と中心でない1つの重なりとして了承(企画運営 11/05)
 * - 旅の足: JR身延線の源道寺駅の近くでレンタカー(9:00から、手続き15分)。帰りも同じ店の近くで返す
 * - 点: 村山浅間神社 node3703070730、山宮浅間神社 way581852988(Nominatim)、狩宿の下馬桜 natural=tree node6296783413、
 *   田貫湖ふれあい自然塾 地理院の住所検索「静岡県富士宮市佐折633番地」(OSM に点なし。公式の住所は佐折633-14)、
 *   昼食 長者の橋 way1244576632(Nominatim)、田貫湖 北岸の眺めの点 node12599162701(名前は英語の「Mirador Lake Tanuki (muelle)」。前の判断の第1の候補)、
 *   富士養鱒場 地理院の住所検索「静岡県富士宮市猪之頭579番地」(OSM に点なし。公式の住所は猪之頭579-2)、
 *   地理院の点の座標: 佐折633番地 35.337605,138.561218、猪之頭579番地 35.368683,138.566498、レンタカーの店 西小泉町14番 35.217621,138.628082(源道寺駅の近く。店の名前はメモに書かない)、人穴富士講遺跡 66d185f1 と同じ 35.361549,138.590719
 * - 区間(routing.openstreetmap.de、車は秒から切り上げ＋5、歩きは切り上げ): 店(西小泉町14番の地理院の点)→村山 545.3秒→15(書き出し)、村山→山宮 245.3→10、
 *   山宮→下馬桜 490.8→14、下馬桜→自然塾 671.0→17、自然塾→長者の橋 266.9→10、長者の橋(Nominatim 35.3422702,138.5644835)→北岸の眺めの点(歩) 1001.6→17、
 *   北岸の眺めの点→長者の橋(歩) 1001.6→17＋長者の橋→富士養鱒場 405.3→12、富士養鱒場→人穴 295.0→10、人穴→店 1005.7→22(帰りの一文)
 * - 時刻: 9:30〜16:47。昼食 12:26。田貫湖の100分は、湖の周り3.3kmを歩く分と、北へ約500mの小田貫湿原の往復と、眺める時間
 * - 出典: 村山浅間神社 city.fujinomiya.lg.jp/1015150000/p001615.html、山宮浅間神社 同 p001614.html・fujinomiya.gr.jp/guide/1159/、
 *   人穴富士講遺跡 同 p001613.html、狩宿の下馬桜 city.fujinomiya.lg.jp/1025200000/p001823.html、田貫湖 同 p001795.html、
 *   小田貫湿原 city.fujinomiya.lg.jp/1030300000/shisetsu/p000096.html、自然塾 tanuki-ko.gr.jp/userguide/・/facility/、
 *   富士養鱒場 fish-exp.pref.shizuoka.jp/fuji/0006/viewing.html・/fuji/、レンタカー rent.toyota.co.jp/shop/?muni=22207
 * - 写真: 田貫湖の写真(表紙)はそのまま。白糸の滝の写真はスポットと一緒に消える
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-tanuki-aea12c13.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "aea12c13-249f-43de-9ed7-e36492da4f64";
const DAY_ID = "11f7f3dd-7e82-4ab4-9d88-6a27eba4a87f";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type Leg = { orderNo: number; transitMode: string; transitDurationMin: number };
const legs = (...xs: [string, number][]): Leg[] => xs.map(([mode, min], i) => ({ orderNo: i + 1, transitMode: mode, transitDurationMin: min }));
const L = (...xs: [string, number][]) => ({ deleteMany: {}, create: legs(...xs) });
const C = (...xs: [string, number][]) => ({ create: legs(...xs) });

const JINBA = "75b7e31d-f4bf-4ea5-82a9-2e1068075a64"; // 外す
const TANUKI = "f6e484b6-8246-44ca-941c-929c42a7b4b0";
const MAKAINO = "189de216-add9-4a75-bbd7-5346a30ea894"; // 外す
const SHIRAITO = "aa36a6fa-161d-4cf2-a893-5495083f2bfa"; // 外す
const SENGEN = "7358a35a-0a40-4030-bd09-3a8d4554e2dd"; // 外す
const CENTER = "3728cfa5-37b3-43a4-9c2f-6cc22f689898"; // 外す
const REMOVE = [JINBA, MAKAINO, SHIRAITO, SENGEN, CENTER];

const EXPECT: Record<string, string> = {
  [JINBA]: "陣馬の滝", [TANUKI]: "田貫湖", [MAKAINO]: "まかいの牧場", [SHIRAITO]: "白糸の滝", [SENGEN]: "富士山本宮浅間大社", [CENTER]: "富士山世界遺産センター",
};
const PHOTOS_EXPECT = ["472ad684-c604-43e5-8ab2-1a45f17e7676", "c2f166ad-43af-4a3b-b1ff-1a143da95b9b"].sort();

const TITLE_OLD = "田貫湖の逆さ富士、湖面に映る絶景を楽しむ静岡富士山プラン";
const TITLE_NEW = "田貫湖と小田貫湿原、富士山信仰の村山・山宮・人穴をめぐる日帰りプラン";
const DESC_OLD = "ダイヤモンド富士でも有名な田貫湖。風のない日には湖面に映る「逆さ富士」を楽しめる、絶景フォトスポット重視のプランです。";
const DESC_NEW =
  "富士山の世界文化遺産の構成資産の村山浅間神社と山宮浅間神社から、国の特別天然記念物の狩宿の下馬桜を経て、田貫湖へ。環境省の田貫湖ふれあい自然塾で富士山麓の自然を知り、富士山を真東に仰ぐ田貫湖を一周して小田貫湿原へ。午後は静岡県の富士養鱒場と、富士講ゆかりの人穴富士講遺跡をたずねる日帰りプランです。自然塾は月曜日などが休館日なので、事前に確かめましょう。";

const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const M = {
  murayama:
    "JR身延線の源道寺駅の近くでレンタカーを借りて(手続きに15分ほど)、車でおよそ15分、村山浅間神社に着きます。富士山の世界文化遺産の構成資産の一つで、このあたりの村山は、富士山の修験道の中心地でした。明治時代の廃仏毀釈で廃されるまで興法寺という寺があり、その中心の建物だった大日堂が、浅間神社と並んで残っています。境内には、山伏や富士登拝の人々が身を清めた水垢離場の跡もあります。" +
    PRAY +
    "この後は、車でおよそ10分、山宮浅間神社へ向かいましょう。",
  yamamiya:
    "村山浅間神社から車でおよそ10分、山宮浅間神社に着きます。富士山本宮浅間大社の起こりとされる神社で、社殿がなく、富士山そのものを拝む古い祭りの形を今に伝えています。境内には、溶岩を並べて区切った南北約15m、東西約8mの遥拝所があり、富士山の方向に祭壇が置かれています。遥拝所の玉垣の中へは、文化財を守るため入れません。富士山の世界文化遺産の構成資産の一つです。" +
    PRAY +
    "この後は、車でおよそ14分、狩宿の下馬桜へ向かいましょう。",
  geba:
    "山宮浅間神社から車でおよそ14分、狩宿の下馬桜に着きます。日本最古級ともいわれるヤマザクラで、昭和27年(1952)に国の特別天然記念物に指定されました。建久4年(1193)に源頼朝が富士の巻狩りを行ったとき、本陣の門前のこの木のところで馬を下りたと言い伝えられています。花は例年4月上旬に咲き、ほかの季節も、大きな木の枝ぶりを眺められます。この後は、車でおよそ17分、田貫湖ふれあい自然塾へ向かいましょう。",
  juku:
    "狩宿の下馬桜から車でおよそ17分、田貫湖のほとりの田貫湖ふれあい自然塾に着きます。環境省の国設の自然学校の第1号として、平成12年(2000)に開かれた施設で、スタッフによる自然の解説や展示を通して、田貫湖と富士山麓の自然にふれることができます。開館は9:30〜16:30で、休館日は4月から10月は月曜日、11月から3月は月曜日と火曜日です。この後は、車でおよそ10分、湖の東側の長者の橋のあたりへ向かいましょう。",
  lunch:
    "田貫湖ふれあい自然塾から車でおよそ10分、田貫湖の東側の長者の橋のあたりに着きます。このあたりで昼食にしましょう。この後は、湖畔を歩いておよそ17分、湖の北側へ向かいましょう。",
  tanuki:
    "長者の橋のあたりから湖畔を歩いておよそ17分、田貫湖の北側に着きます。田貫湖は、東西約1km、南北約0.5km、周囲3.3kmの湖で、真東に富士山の全景を仰ぎ、湖面に富士山を映します。4月と8月のそれぞれ1週間ほどは、富士山の頂から朝日が昇るダイヤモンド富士が見られることでも知られています。湖のまわりの道を一周すると、春の桜から秋の紅葉まで、季節の木々と富士山の眺めが続きます。湖から北へ約500m、歩いて15分ほどのところには、富士山の西のふもとに残る唯一の湿原とされる小田貫湿原があり、湿原の中央を通る木道から、湿原の植物や生きものを観察できます。木道から外れずに歩きましょう。この後は、長者の橋のあたりまで歩いておよそ17分、そこから車でおよそ12分、富士養鱒場へ向かいましょう。",
  yoson:
    "田貫湖から長者の橋のあたりの車へ戻り、車でおよそ12分、富士養鱒場に着きます。静岡県の水産・海洋技術研究所の施設で、研究用や展示用に育てている魚を、観覧できる区域から見ることができます。飼育池は深く、水が冷たいので、小さな子ども連れは気をつけましょう。開場は9:00〜16:30(入場は16:00まで)です。この後は、車でおよそ10分、人穴富士講遺跡へ向かいましょう。",
  hitoana:
    "富士養鱒場から車でおよそ10分、人穴富士講遺跡に着きます。富士山の世界文化遺産の構成資産の一つで、人穴浅間神社の境内に、溶岩流の中にできた長さ約83mの溶岩洞穴「人穴」と、富士講の信者が建てた232基の碑塔があります。江戸の富士講の開祖とされる長谷川角行が、この人穴にこもって修行したと伝わり、富士講が盛んになった江戸時代の中ごろからは、霊地として関東の各地から信者が訪れました。碑塔のまわりでは、静かに過ごしましょう。見学できるのは道を整えた一部の区間だけなので、柵を越えないようにしましょう。" +
    PRAY +
    "旅を締めくくったら、源道寺駅の近くまで車でおよそ22分です。駅の近くで車を返しましょう。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  {
    label: "村山浅間神社(新規。1か所目。点 place_of_worship node3703070730)",
    item: { create: { name: "村山浅間神社", address: "富士宮市村山", lat: "35.261217", lng: "138.666133", visitTime: T(9, 30), stayDurationMin: 40, memo: M.murayama } },
  },
  {
    label: "山宮浅間神社(新規。点 place_of_worship way581852988、車10)",
    item: { create: { name: "山宮浅間神社", address: "富士宮市山宮740", lat: "35.271175", lng: "138.636965", visitTime: T(10, 20), stayDurationMin: 25, memo: M.yamamiya, transitLegs: C(["car", 10]) } },
  },
  {
    label: "狩宿の下馬桜(新規。点 natural=tree node6296783413、車14)",
    item: { create: { name: "狩宿の下馬桜", address: "富士宮市狩宿", lat: "35.301267", lng: "138.588524", visitTime: T(10, 59), stayDurationMin: 20, memo: M.geba, transitLegs: C(["car", 14]) } },
  },
  {
    label: "田貫湖ふれあい自然塾(新規。点 地理院「富士宮市佐折633番地」、車17)",
    item: {
      create: {
        name: "田貫湖ふれあい自然塾", address: "富士宮市佐折633-14", lat: "35.337605", lng: "138.561218",
        visitTime: T(11, 36), stayDurationMin: 40, memo: M.juku, transitLegs: C(["car", 17]),
      },
    },
  },
  {
    label: "田貫湖のあたりで昼食(新規。点 長者の橋 way1244576632、車10)",
    item: { create: { name: "田貫湖のあたりで昼食", lat: "35.34227", lng: "138.564484", visitTime: T(12, 26), stayDurationMin: 40, memo: M.lunch, transitLegs: C(["car", 10]) } },
  },
  {
    label: "田貫湖と小田貫湿原(既存の田貫湖を改名。点 北岸の眺めの点 node12599162701、歩き17。田貫湖の写真(表紙)はそのまま)",
    item: {
      id: TANUKI,
      data: {
        name: "田貫湖と小田貫湿原", lat: "35.345766", lng: "138.558598", visitTime: T(13, 23), stayDurationMin: 100, memo: M.tanuki,
        transitLegs: L(["walk", 17]),
      },
    },
  },
  {
    label: "富士養鱒場(新規。点 地理院「富士宮市猪之頭579番地」、歩き17＋車12)",
    item: {
      create: {
        name: "富士養鱒場", address: "富士宮市猪之頭579-2", lat: "35.368683", lng: "138.566498",
        visitTime: T(15, 32), stayDurationMin: 40, memo: M.yoson, transitLegs: C(["walk", 17], ["car", 12]),
      },
    },
  },
  {
    label: "人穴富士講遺跡(新規。点 66d185f1 と同じ 35.361549,138.590719、車10、帰りの一文)",
    item: { create: { name: "人穴富士講遺跡", address: "富士宮市人穴", lat: "35.361549", lng: "138.590719", visitTime: T(16, 22), stayDurationMin: 25, memo: M.hitoana, transitLegs: C(["car", 10]) } },
  },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true } });
  if (it?.title !== TITLE_OLD || it?.description !== DESC_OLD) throw new Error("題か説明文が想定と違います");
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, select: { id: true, name: true } });
  for (const [id, name] of Object.entries(EXPECT)) {
    const s = spots.find((x) => x.id === id);
    if (!s || s.name !== name) throw new Error(`今のスポットが想定と違います: ${id} 想定「${name}」 実際「${s?.name}」`);
  }
  if (spots.length !== Object.keys(EXPECT).length) throw new Error(`スポットの数が想定と違います: ${spots.length}`);
  const photos = await prisma.photo.findMany({ where: { spot: { dayId: DAY_ID } }, select: { id: true } });
  if (JSON.stringify(photos.map((p) => p.id).sort()) !== JSON.stringify(PHOTOS_EXPECT)) throw new Error(`写真が想定と違います: ${photos.map((p) => p.id).join(",")}`);

  console.log(`題: ${TITLE_OLD}\n→ ${TITLE_NEW}\n説明文:\n  ${DESC_OLD}\n→ ${DESC_NEW}\n季節・表紙: そのまま\n`);
  for (const { label, item } of SPOTS) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
    const lg = d.transitLegs as { create?: Leg[]; deleteMany?: object } | undefined;
    const legsStr = lg?.create ? lg.create.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(区間なし)";
    console.log(
      `■ ${"id" in item ? "[既存]" : "[新規]"} ${label}${d.name ? `\n  名前: ${d.name}` : ""}\n  着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}\n  ${d.memo}`
    );
  }
  for (const id of REMOVE) console.log(`■ [外す] ${EXPECT[id]} (${id})`);
  console.log("  写真: 田貫湖の写真(表紙)はそのまま。白糸の滝の写真はスポットと一緒に消える");
  console.log("\n  始まり 9:30(8:30〜9:30)/ 昼食 12:26(13:30より前)/ 終わり 人穴富士講遺跡 16:47(日帰りの 16:30〜17:00)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW } });
      await setDaySpotOrder(DAY_ID, SPOTS.map((r) => r.item), { tx, remove: REMOVE });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

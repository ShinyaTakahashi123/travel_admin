/**
 * 高浜海水浴場と大瀬崎灯台、五島の絶景ビーチと断崖プラン(7d6f199f)の組み直し(2026-11-05、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の 7d6f199f の欄(組み直しが要るしおり)。11/05 2時半ごろに制作から制作補助2へ移った分。
 * - 題の中心の高浜海水浴場と大瀬崎灯台は残す。b7eb511a と重なる道の駅遣唐使ふるさと館・鬼岳・五島観光歴史資料館と、
 *   40f8801b と重なる堂崎天主堂を外し、西側の公的な場所で組む(企画運営 11/05)。白良ヶ浜万葉公園は点が取れず外した。
 *   井持浦教会は 40f8801b と中心でない1つの重なりとして了承(企画運営 11/05)。行き先の数を保つため白鳥神社を足した(企画運営 11/05 ア)
 * - 旅の足: 長崎港から朝の船で福江港(9:05着の便)。港の近くでレンタカー(手続き15分)。帰りも同じ店で返し、最終のフェリー(16:50発)に間に合う「最終便」の例外
 * - 点: 大宝寺 地理院のベクトルタイルの寺院の注記「大宝寺」32.601501,128.652621(地理院の住所検索は大字までしか出ず、OSM に点なし。例外として了承)、
 *   白鳥神社 地理院のベクトルタイルの神社の注記「白鳥神社」32.628893,128.620456(OSM に点なし。例外として了承)、
 *   大瀬崎灯台展望所 名前のない viewpoint node14292543224(あずまや way1569043955 から約5m、トイレ node14292543219 から約37m。例外として了承。40f8801b にも使う)、
 *   井持浦教会 node2707991640(カトリック井持浦教会)、昼食 三井楽郵便局 node1423797566、高浜海水浴場 node6326615994(今の点のまま)、
 *   レンタカーの店 地理院の住所検索「三尾野三丁目1番9号」32.690624,128.84111(店の名前はメモに書かない)
 * - 区間(routing.openstreetmap.de、車は秒から切り上げ＋5): 港→店 176.6秒→8(送迎)、店→大宝寺 1522.4→31(書き出し)、大宝寺→白鳥神社 635.1→16、白鳥神社→大瀬崎 734.2→18、
 *   大瀬崎→井持浦 461.7→13、井持浦→三井楽郵便局 1380.7→29、三井楽→高浜 302.8→11、高浜→店 1103.6→24(帰りの一文)
 * - 時刻: 9:05着＋降りる10＋送迎8＋手続き15＋車31＝大宝寺 10:09。昼食 13:30。高浜 14:26〜15:36。返却と送迎のあと港に 16:18 ごろ、16:50 発まで約32分
 * - 出典(五島市公式「五島の島たび」): 大宝寺 goto.nagasaki-tabinet.com/spot/672、白鳥神社 /spot/673、大瀬埼灯台 /spot/674、井持浦教会とルルド /spot/670、
 *   高浜海水浴場 /spot/682、教会の作法 五島市発行の冊子 /downloads/media/3072
 * - 写真: 高浜・大瀬崎の2枚と表紙はそのまま。季節もそのまま
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-goto-7d6f199f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "7d6f199f-1a16-4795-a081-bd8308ce650a";
const DAY_ID = "1bef12cd-229c-411c-bc45-a963a94d33f9";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type Leg = { orderNo: number; transitMode: string; transitDurationMin: number };
const legs = (...xs: [string, number][]): Leg[] => xs.map(([mode, min], i) => ({ orderNo: i + 1, transitMode: mode, transitDurationMin: min }));
const L = (...xs: [string, number][]) => ({ deleteMany: {}, create: legs(...xs) });
const C = (...xs: [string, number][]) => ({ create: legs(...xs) });

const MICHINOEKI = "112ac1ba-e97e-47bf-8314-8553c88c9683"; // 外す
const TAKAHAMA = "000c730e-f595-4873-b799-c6381acd0384";
const OSEZAKI = "8cc8e992-90ab-497d-8916-13a2964edb8e";
const IMOCHIURA = "9951f5a8-5599-4a72-a009-1c3f479ab4b6";
const ONIDAKE = "11b07b5a-0e4b-4876-b970-08741530f3ef"; // 外す
const SHIRYOKAN = "f419a10a-0181-4c56-ab05-d2d3ae3d7ff3"; // 外す
const DOZAKI = "f01b0bfa-bea5-4fed-80cf-832779768882"; // 外す
const REMOVE = [MICHINOEKI, ONIDAKE, SHIRYOKAN, DOZAKI];

const EXPECT: Record<string, string> = {
  [MICHINOEKI]: "道の駅遣唐使ふるさと館", [TAKAHAMA]: "高浜海水浴場", [OSEZAKI]: "大瀬崎灯台", [IMOCHIURA]: "井持浦教会",
  [ONIDAKE]: "鬼岳", [SHIRYOKAN]: "五島観光歴史資料館", [DOZAKI]: "堂崎天主堂",
};
const PHOTOS_EXPECT = ["241b42a8-21da-4ae0-af67-6f9a2fa24a5f", "0e9b6ea6-5376-4319-afce-67da1e9ca89b"].sort();

const TITLE = "高浜海水浴場と大瀬崎灯台、五島の絶景ビーチと断崖プラン";
const DESC_OLD = "「日本の水浴場88選」にも選ばれた高浜海水浴場と、東シナ海を望む大瀬崎灯台の断崖。五島列島西部の絶景を楽しむプランです。";
const DESC_NEW = "白い砂浜の高浜海水浴場と、断崖に立つ大瀬崎灯台。西の高野山と呼ばれる大宝寺や、井持浦教会のルルドも訪ねる、福江島西部の日帰りプランです。";

const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const M = {
  daiho:
    "長崎港から朝の船で福江港へ渡り、港の近くでレンタカーを借りて(手続きに15分ほど)、車でおよそ31分、大宝寺に着きます。船の運航と時刻は、公式で確かめましょう。大宝寺は、大宝元年(701)の創建と伝えられ、五島で最も古い寺とされています。大同元年(806)には、遣唐使に随行して唐から帰る途中の空海がこの付近に流れ着き、真言密教の教えを説いたとされ、高野山に対して「西の高野山」と呼ばれるようになりました。五島八十八ヶ所の八十八番札所でもあり、境内には長崎県指定有形文化財の梵鐘があります。" +
    PRAY +
    "この後は、車でおよそ16分、白鳥神社へ向かいましょう。",
  shiratori:
    "大宝寺から車でおよそ16分、玉之浦湾に面した白鳥神社に着きます。日本武尊を祀る神社で、文武天皇2年(698)に祀られたと伝えられ、五島では五社神社に次いで2番目に古いとされています。社殿が湾に向かって建っていて、鳥居をくぐって振り返ると、湾の眺めが広がります。延暦23年(804)には、遣唐使とともに旅立つ最澄が参詣したとも伝えられています。" +
    PRAY +
    "この後は、車でおよそ18分、大瀬崎灯台の展望所へ向かいましょう。",
  osezaki:
    "白鳥神社から車でおよそ18分、大瀬崎灯台を眺める展望所に着きます。福江島の西の端、東シナ海に突き出た断崖の上に白い大瀬埼灯台が立ち、「日本の灯台50選」に選ばれています。断崖は、「五島層群」と呼ばれる大陸由来の砂と泥の地層が、東シナ海の荒波に削られてできたもので、晴れた日には沖の男女群島も見渡せます。灯台までは遊歩道がありますが、行きは下りで約20分、帰りは上りで約40分かかるため、このプランでは展望所から灯台を眺めます。断崖のふちには近づかないようにしましょう。この後は、車でおよそ13分、井持浦教会へ向かいましょう。",
  imochiura:
    "大瀬崎灯台の展望所から車でおよそ13分、井持浦教会に着きます。かつて大村藩から移り住んだキリシタンが潜伏した地区で、明治30年(1897)に建てられたレンガ造りの教会が台風で倒れたのち、昭和63年(1988)に今のコンクリート造りの教会になりました。境内のルルドは、ペリュー神父の呼びかけで五島の信徒が島内の奇岩や珍しい石を集め、明治32年(1899)に造ったもので、日本で最初のルルドとされています。ミサや教会の行事の最中は妨げにならないようにし、教会の中では、原則として撮影はできません。" +
    PRAY +
    "この後は、車でおよそ29分、三井楽へ向かいましょう。",
  lunch:
    "井持浦教会から車でおよそ29分、三井楽の町に着きます。このあたりで昼食にしましょう。この後は、車でおよそ11分、高浜海水浴場へ向かいましょう。",
  takahama:
    "三井楽の町から車でおよそ11分、高浜海水浴場に着きます。白い砂浜の先に、浅いところは透きとおったエメラルドグリーン、沖はコバルトブルーの海が広がります。潮が引いたときには、寄せては返す波が砂を動かしてできる「リップルマーク」という波の模様が、砂浜に現れます。そばを通る国道384号は「日本の道百選」に選ばれ、海を見下ろす道が続きます。海水浴の期間は夏の間に限られるので、泳ぐときは公式で期間を確かめましょう。旅を締めくくったら、福江の店まで車でおよそ24分です。車を返して福江港へ向かい、帰りの船の時刻も公式で確かめておきましょう。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  {
    label: "大宝寺(新規。1か所目、区間なし。点 地理院の寺院の注記「大宝寺」)",
    item: { create: { name: "大宝寺", address: "五島市玉之浦町大宝631", lat: "32.601501", lng: "128.652621", visitTime: T(10, 9), stayDurationMin: 30, memo: M.daiho } },
  },
  {
    label: "白鳥神社(新規。点 地理院の神社の注記「白鳥神社」、車16)",
    item: { create: { name: "白鳥神社", address: "五島市玉之浦町玉之浦1629", lat: "32.628893", lng: "128.620456", visitTime: T(10, 55), stayDurationMin: 25, memo: M.shiratori, transitLegs: C(["car", 16]) } },
  },
  {
    label: "大瀬崎灯台展望所(既存の大瀬崎灯台を改名。点 viewpoint node14292543224、車18。写真(表紙)はそのまま)",
    item: {
      id: OSEZAKI,
      data: { name: "大瀬崎灯台展望所", lat: "32.613378", lng: "128.607844", visitTime: T(11, 38), stayDurationMin: 45, memo: M.osezaki, transitLegs: L(["car", 18]) },
    },
  },
  {
    label: "井持浦教会(既存。点 node2707991640 のまま、車13)",
    item: {
      id: IMOCHIURA,
      data: { address: "五島市玉之浦町玉之浦1243", lat: "32.619183", lng: "128.611793", visitTime: T(12, 36), stayDurationMin: 25, memo: M.imochiura, transitLegs: L(["car", 13]) },
    },
  },
  {
    label: "三井楽で昼食(新規。点 三井楽郵便局 node1423797566、車29)",
    item: { create: { name: "三井楽で昼食", lat: "32.74267", lng: "128.690689", visitTime: T(13, 30), stayDurationMin: 45, memo: M.lunch, transitLegs: C(["car", 29]) } },
  },
  {
    label: "高浜海水浴場(既存。点 node6326615994 のまま、車11、帰りの一文。写真はそのまま)",
    item: {
      id: TAKAHAMA,
      data: { address: "五島市三井楽町貝津1054-1", lat: "32.708031", lng: "128.661606", visitTime: T(14, 26), stayDurationMin: 70, memo: M.takahama, transitLegs: L(["car", 11]) },
    },
  },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true } });
  if (it?.title !== TITLE || it?.description !== DESC_OLD) throw new Error("題か説明文が想定と違います");
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, select: { id: true, name: true } });
  for (const [id, name] of Object.entries(EXPECT)) {
    const s = spots.find((x) => x.id === id);
    if (!s || s.name !== name) throw new Error(`今のスポットが想定と違います: ${id} 想定「${name}」 実際「${s?.name}」`);
  }
  if (spots.length !== Object.keys(EXPECT).length) throw new Error(`スポットの数が想定と違います: ${spots.length}`);
  const photos = await prisma.photo.findMany({ where: { spot: { dayId: DAY_ID } }, select: { id: true } });
  if (JSON.stringify(photos.map((p) => p.id).sort()) !== JSON.stringify(PHOTOS_EXPECT)) throw new Error(`写真が想定と違います: ${photos.map((p) => p.id).join(",")}`);

  console.log(`題: ${TITLE}(そのまま)\n説明文:\n  ${DESC_OLD}\n→ ${DESC_NEW}\n季節・表紙: そのまま\n`);
  for (const { label, item } of SPOTS) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
    const lg = d.transitLegs as { create?: Leg[]; deleteMany?: object } | undefined;
    const legsStr = lg?.create ? lg.create.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(区間なし)";
    console.log(
      `■ ${"id" in item ? "[既存]" : "[新規]"} ${label}${d.name ? `\n  名前: ${d.name}` : ""}${d.address ? `\n  住所: ${d.address}` : ""}\n  着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}\n  ${d.memo}`
    );
  }
  for (const id of REMOVE) console.log(`■ [外す] ${EXPECT[id]} (${id})`);
  console.log("  写真: 高浜・大瀬崎の2枚(大瀬崎が表紙)はそのまま。外すスポットに写真はない");
  console.log("\n  始まり 大宝寺 10:09(福江港 9:05 着＋10＋8＋15＋31)/ 昼食 13:30(13:30まで)/ 終わり 高浜海水浴場 15:36(最終便の例外。港に16:18ごろ、16:50発まで約32分)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { description: DESC_NEW } });
      await setDaySpotOrder(DAY_ID, SPOTS.map((r) => r.item), { tx, remove: REMOVE });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

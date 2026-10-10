/**
 * #24 657f4a15（箱根）企画運営の指摘4点。
 * 1) 芦ノ湖遊覧船の区間を「元箱根港→箱根町港」の片道に限定し、時間と合わせる。
 *    帰り方(決まり3)を一言追加。冬の最終便は公式で確認する旨のみ記載(時刻は書かない)。
 *    → fix-24d-657f4a15.ts で別途対応。
 * 2) 「海側から」→「湖の上から」（芦ノ湖は湖のため）。→ fix-24d で対応。
 * 3) Day1: 箱根美術館は改修休館中のため引き続き外観のみ(20分)。強羅公園・彫刻の森
 *    美術館の滞在をやや短縮し、早雲山駅(新規、cu-mo箱根の展望テラス・足湯)・
 *    大涌谷(新規、ロープウェイ、事前予約制と明記)・箱根ガラスの森美術館(新規、
 *    ヴェネチアン・グラス)を追加。強羅温泉は150分→60分に短縮(決まりA)。
 *    最後のポーラ美術館の本文で宿(強羅温泉)へ向かう一言を追加。
 * 4) Day1はロープウェイ(早雲山〜大涌谷)、Day2は遊覧船(元箱根〜箱根町)で、
 *    同じ乗り物を2日続けて使っていないことを確認。
 *
 * 座標: Nominatim確認。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DAY1_ID = "ca41802e-c905-41c2-abc2-44d10bbb3c4b";
const HAKONE_MUSEUM_ID = "5bcc4d93-f84f-4220-8f9e-10a24f01db75";
const GORA_PARK_ID = "628cdf0d-097e-4ee2-9831-53a22f8a3102";
const CHOKOKU_ID = "910deb0e-a899-48cb-a101-9ca61d0a1507";
const POLA_ID = "24a6970d-413b-46ed-a419-76281978b78d";
const GORA_ONSEN_ID = "fc5e5edc-d294-4042-b636-176283064a76";

const HAKONE_MUSEUM_MEMO =
  "箱根登山鉄道の強羅駅から徒歩約7分、箱根美術館は実業家・岡田茂吉（1882〜1955）が集めた古美術品を紹介する美術館です。岡田茂吉は日本・中国・南アジアなどの古美術品を熱心に収集し、1952年にこの地に美術館を開館させました。敷地『神仙郷』は、岡田茂吉が戦中から戦後にかけて自ら造成したもので、約130種の苔と200本以上のイロハモミジを組み合わせた『苔庭』は、多くの人を魅了する美しさといわれています。残念ながら現在は改修工事のため休館しております。再開の時期は公式サイトで確かめてください。苔庭は今回眺められませんが、すぐ近くの強羅公園でも緑を楽しめますので、続けて向かってみましょう。";

const GORA_PARK_MEMO =
  "箱根美術館から歩いてすぐの強羅公園は、大正3年（1914年）に開園した、日本で最も古いフランス式整型庭園です。斜面地に噴水池や花壇を左右対称に配置した、幾何学的で整然としたデザインが特徴で、開園当初は華族をはじめとする上流階級の人々が親睦や保養のために利用する施設だったと伝えられています。戦後の1957年になって有料公園として一般に開放され、現在は公園全体が国登録記念物に登録されています。桜やつつじ、あじさい、バラなど、四季を通じて折々の花が楽しめる公園としても親しまれています。園内の『熱帯植物館』には、国内最古といわれる巨大なブーゲンビレアや、日本で初めてとされる熱帯ハーブ専門の温室があり、外の庭園とはまた違った緑の世界を楽しめます。斜面を利用した園内は起伏があるので、歩きやすい靴で散策するのがおすすめです。この後は、歩いておよそ9分、彫刻の森美術館へ向かいましょう。";

const CHOKOKU_MEMO =
  "強羅公園から歩いておよそ9分、彫刻の森美術館に着きます。1969年に開館した、日本で最初の野外彫刻美術館とされています。箱根の山々を望む広大な野外展示場には、ヘンリー・ムーアをはじめとする内外の彫刻家の作品およそ120点が点在し、自然の中を歩きながら鑑賞できます。館内にはピカソ館もあり、絵画から陶器、彫刻まで幅広い作品が並んでいます。屋外・屋内の両方でじっくりと芸術に浸れる場所です。この後は、箱根登山電車とケーブルカーを乗り継いでおよそ15分、早雲山駅へ向かいましょう。";

const SOUNZAN_MEMO =
  "彫刻の森美術館から箱根登山電車とケーブルカーを乗り継いでおよそ15分、箱根ロープウェイの起点、早雲山駅に着きます。駅舎2階の「cu-mo箱根」には展望テラスと足湯があり、強羅の町並みや、晴れた日には相模湾まで見渡すパノラマを楽しめます。足湯につかりながら、これから向かう大涌谷への空中散歩に思いをはせてみてください。この後は、箱根ロープウェイでおよそ8分、大涌谷へ向かいましょう。";

const OWAKUDANI_MEMO =
  "早雲山駅から箱根ロープウェイでおよそ8分、大涌谷に着きます。およそ3,000年前の箱根山の水蒸気爆発によってできた爆裂火口跡で、今も白い噴煙が立ちのぼり、あたりには硫黄の匂いが漂っています。ロープウェイの車窓からは、噴気を上げる谷の様子とともに、天気が良ければ富士山の姿も望めます。大涌谷の散策エリアに立ち入る際は、事前にウェブサイトから予約が必要なので、訪れる前に確かめておきましょう。この後は、バスでおよそ15分、箱根ガラスの森美術館へ向かいましょう。";

const GARASUNOMORI_MEMO =
  "大涌谷からバスでおよそ15分、仙石原の緑に囲まれた箱根ガラスの森美術館に着きます。ヴェネチアン・グラスを専門に紹介する美術館で、15世紀から19世紀にかけてのヴェネチアングラスの名品や、現代作家によるガラス作品を展示しています。庭園からエントランスへと続く橋には、高さおよそ9m、全長およそ10mのクリスタル・ガラスのアーチが架けられており、およそ16万粒のガラスが箱根の風にゆれてさまざまな表情を見せてくれます。ガラス細工の体験工房も併設されているので、時間があれば挑戦してみるのもおすすめです。この後は、バスでおよそ8分、ポーラ美術館へ向かいましょう。";

const POLA_MEMO_NEW =
  "箱根ガラスの森美術館からバスでおよそ8分、仙石原の森の中にあるポーラ美術館に着きます。印象派から現代アートまで、国内外の絵画や工芸品を幅広く所蔵する私立美術館で、ガラス張りの開放的な建物が、周囲のブナ林と一体となった景観を作り出しています。展示だけでなく、建物と森を一緒に楽しめる遊歩道も整備されており、芸術と自然の両方を味わえる場所です。この後は、バスでおよそ12分、今夜の宿がある強羅温泉へ向かいましょう。";

const GORA_ONSEN_MEMO_NEW =
  "ポーラ美術館からバスでおよそ12分、箱根の温泉街の一つ、強羅温泉に着きます。この温泉地は、明治27年（1894年）に早雲山からの引き湯によって温泉開発が始まるまでは、家一軒ない草原地帯だったと伝えられています。大正8年（1919年）に箱根登山鉄道が開通すると、温泉付きの別荘地として分譲が進み、次第に温泉地としての姿を整えていきました。箱根十七湯と呼ばれる箱根の温泉地の中では、比較的新しく開かれた温泉地です。その後、昭和27年（1952年）に初めて温泉の掘削に成功し、以後、独自の源泉が次々と発見されていったといわれています。『強羅』という地名の由来には、岩石が積み重なった傾斜地で石がごろごろしていることから来たという説のほか、サンスクリット語（梵語）で『石の地獄』を意味する言葉に由来するという説も伝えられています。今夜の宿にチェックインしたら、ケーブルカーや宿からの夜景を楽しみながら、湯につかって明日への英気を養ってください。";

async function main() {
  const day1Spots: SpotOrderItem[] = [
    { id: HAKONE_MUSEUM_ID, data: { memo: HAKONE_MUSEUM_MEMO, visitTime: t(9, 30), stayDurationMin: 20, transitMode: null, transitDurationMin: null, transitLine: null } },
    { id: GORA_PARK_ID, data: { memo: GORA_PARK_MEMO, visitTime: t(9, 53), stayDurationMin: 50, transitMode: "walk", transitDurationMin: 3, transitLine: null } },
    { id: CHOKOKU_ID, data: { memo: CHOKOKU_MEMO, visitTime: t(10, 52), stayDurationMin: 65, transitMode: "walk", transitDurationMin: 9, transitLine: null } },
    { create: { name: "早雲山駅", address: "神奈川県足柄下郡箱根町強羅", lat: 35.246383, lng: 139.035603, memo: SOUNZAN_MEMO, visitTime: t(12, 12), stayDurationMin: 15, transitMode: "train", transitDurationMin: 15, transitLine: null } },
    { create: { name: "大涌谷", address: "神奈川県足柄下郡箱根町仙石原", lat: 35.247406, lng: 139.024205, memo: OWAKUDANI_MEMO, visitTime: t(12, 35), stayDurationMin: 40, transitMode: "other", transitDurationMin: 8, transitLine: null } },
    { create: { name: "箱根ガラスの森美術館", address: "神奈川県足柄下郡箱根町仙石原940-48", lat: 35.266182, lng: 139.017673, memo: GARASUNOMORI_MEMO, visitTime: t(13, 30), stayDurationMin: 50, transitMode: "bus", transitDurationMin: 15, transitLine: null } },
    { id: POLA_ID, data: { memo: POLA_MEMO_NEW, visitTime: t(14, 28), stayDurationMin: 65, transitMode: "bus", transitDurationMin: 8, transitLine: null } },
    { id: GORA_ONSEN_ID, data: { memo: GORA_ONSEN_MEMO_NEW, visitTime: t(15, 45), stayDurationMin: 60, transitMode: "bus", transitDurationMin: 12, transitLine: null } },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of day1Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const stay = d.stayDurationMin as number;
    console.log(`${hm(st)}-${hm(st + stay)} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}分${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`}`);
    prevEnd = st + stay;
  }
  console.log(`Day1終了: ${hm(prevEnd)}`);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(DAY1_ID, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

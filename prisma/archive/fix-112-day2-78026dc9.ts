/**
 * #112 78026dc9(大聖院と紅葉谷公園)のDay2を新規に組む。企画運営の
 * 回答(10/1 15:07)により、比治山公園・広島市現代美術館を追加して
 * 16:30に届かせた(平和記念公園・資料館は、この8か所で足りたため
 * 今回は使わなかった)。広島城天守の閉鎖は、具体的な日付・先の年を
 * 書かず「展示の入れ替えのため、天守には入れない期間があります。
 * 公式の案内で確かめましょう」という書き方にした(企画運営の指示どおり)。
 *
 * 広島城(石垣・堀など城跡)→広島護国神社→縮景園→広島県立美術館→
 * 本通商店街(昼食)→頼山陽史跡資料館→比治山公園→広島市現代美術館、
 * 09:00〜16:37。
 *
 * 事実確認(開いたURL、検索結果の要約):
 * - 広島城: 天正17年(1589)毛利輝元が築城開始・通称「鯉城」・天守は
 *   原爆で倒壊、昭和33年(1958)に鉄筋コンクリート造で外観復元:
 *   shirobito.jp等。天守閉鎖: hiroshimacastle.jp(公式お知らせ)
 * - 縮景園: 浅野家2代藩主・浅野長晟の命で家老・茶人の上田宗箇が作庭、
 *   中国の西湖を模したことから「縮景」の名: shukkeien.jp等
 * - 広島県立美術館: 昭和53年(1978)、広島銀行創業100周年記念で設立、
 *   縮景園に隣接: 検索結果各種
 * - 頼山陽史跡資料館(頼山陽居室): 頼山陽(1781-1832)は大坂生まれ
 *   広島育ちの江戸後期の歴史家・漢詩人、主著『日本外史』(文政9年/
 *   1826完成、幕末の志士に影響)。頼山陽居室(日本外史の草稿をまとめた
 *   場所)は原爆で焼失、昭和33年(1958)広島県により復元:
 *   pref.hiroshima.lg.jp等
 * - 比治山公園: 名前の由来は諸説(人名/肘の形に似る)、市内有数の桜の
 *   名所(およそ1300本): kotobank.jp等
 * - 広島市現代美術館: 平成元年(1989)開館、公立の現代美術館としては
 *   日本初とされる、建築家・黒川紀章設計、比治山公園の高台に立地:
 *   ja.wikipedia.org等
 *
 * 本通商店街の昼食は、OSM確認で広島城〜頼山陽資料館の中心部bboxに
 * 多数の食事処あり(具体的な店名は書かない)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const HIROSHIMAJO_MEMO =
  "フェリーで宮島口へ渡り、路面電車などで広島市内へ向かい、2日目は広島城から始まります。天正17年(1589)、毛利輝元が、太田川のデルタに城地を定めて築城を始めた城で、「鯉城」の愛称でも親しまれています。天守は、昭和20年(1945)の原爆により倒壊し、昭和33年(1958)、鉄筋コンクリート造で外観を復元した現在の姿になりました。現在、展示の入れ替えのため、天守には入れない期間があります。公式の案内で確かめましょう。石垣や堀は築城当時の面影を伝えていて、広い城跡公園を散策できます。この後は、歩いてすぐ、広島護国神社へ向かいましょう。";

const GOKOKUJINJA_MEMO =
  "広島城から歩いてすぐ、広島護国神社に着きます。郷土のために尽くし、亡くなった人々の御霊を祀る神社で、広島城跡の一角に鎮座しています。静かな境内で、敬意を込めて手を合わせましょう。この後は、歩いておよそ10分、縮景園へ向かいましょう。";

const SHUKKEIEN_MEMO =
  "広島護国神社から歩いておよそ10分、縮景園に着きます。元和6年(1620)、浅野家の2代藩主・浅野長晟の命を受けて、家老で茶人としても名高い上田宗箇が築いた、大名庭園です。中国・杭州の名勝「西湖」を模して景色を縮めたことから、「縮景園」と名付けられたと伝えられています。池を中心にめぐる回遊式の庭園で、橋や築山、茶室などが巧みに配され、四季折々の景色を楽しめます。日本の名園100選にも数えられる庭園を、ゆっくり歩いてみましょう。この後は、歩いてすぐ、広島県立美術館へ向かいましょう。";

const KENBI_MEMO =
  "縮景園から歩いてすぐ、広島県立美術館に着きます。昭和53年(1978)、広島銀行の創業100周年を記念して設立された美術館で、縮景園に隣接する立地から、庭園の景色を眺めながら作品を鑑賞できる展示室もあります。広島ゆかりの作家の作品をはじめ、日本画・洋画・工芸など幅広いジャンルの所蔵品を紹介しています。庭園めぐりの続きとして、美術にふれるひとときを過ごしましょう。この後は、歩いておよそ14分、本通商店街へ向かいましょう。";

const HONDORI_MEMO =
  "広島県立美術館から歩いておよそ14分、本通商店街に着きます。広島市の中心部を東西に貫く、アーケードに覆われた商店街です。飲食店や土産物店、老舗から新しい店まで幅広く軒を連ねていて、広島の街歩きの拠点になっています。このあたりには食事処も多いので、ここで昼食にしましょう。この後は、歩いておよそ4分、頼山陽史跡資料館へ向かいましょう。";

const RAISANYO_MEMO =
  "本通商店街から歩いておよそ4分、頼山陽史跡資料館に着きます。頼山陽(1781〜1832)は、大坂に生まれ、広島で育った江戸時代後期の歴史家・漢詩人です。主著『日本外史』は、文政9年(1826)に完成した全22巻の歴史書で、幕末の尊王攘夷の志士たちにも大きな影響を与えたと伝えられています。この資料館は、山陽が『日本外史』の草稿をまとめたとされる「頼山陽居室」を中心とする史跡で、建物は原爆で焼失したのち、昭和33年(1958)に広島県によって復元されました。幕末の歴史を動かした一冊が生まれた場所に、思いをはせてみましょう。この後は、路面電車などでおよそ22分、比治山公園へ向かいましょう。";

const HIJIYAMA_MEMO =
  "頼山陽史跡資料館から、路面電車などでおよそ22分、比治山公園に着きます。名前の由来には、比治という人物が住んでいたからとも、山の形が肘を横にした姿に似ているからとも、諸説あります。市内でも有数の桜の名所として知られ、およそ1300本の桜が植えられています。小高い丘になっていて、市街地を見渡せる眺めも魅力です。緑豊かな散策路を歩きながら、ひと息つきましょう。この後は、歩いておよそ3分、広島市現代美術館へ向かいましょう。";

const MOCA_MEMO =
  "比治山公園から歩いておよそ3分、この旅の締めくくり、広島市現代美術館に着きます。平成元年(1989)に開館した、公立の現代美術館としては日本で初めてとされる美術館です。建築家・黒川紀章の設計で、三角屋根が日本の土蔵を思わせる外観や、建物の6割が地下に収められ、比治山の緑と調和するように造られた構造が特徴です。国内外の現代美術作品を所蔵・展示していて、比治山の木々に囲まれた静かな環境の中で鑑賞できます。宮島の古刹と渓谷、広島市内の城と庭をめぐる旅はこれで終わりです。広島駅へ向かい、帰りの新幹線や電車に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '78026dc9%'`);
  const itinId = rows[0].id;
  const day2Id = "2a556418-b293-432a-a2b2-4292f1aa458f";

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day2Spots: SpotOrderItem[] = [
    {
      create: {
        name: "広島城",
        address: "広島県広島市中区基町21-1",
        lat: 34.4021463,
        lng: 132.4595399,
        memo: HIROSHIMAJO_MEMO,
        visitTime: t(9, 0),
        stayDurationMin: 55,
      },
    },
    {
      create: {
        name: "広島護国神社",
        address: "広島県広島市中区基町21-2",
        lat: 34.4011,
        lng: 132.4588682,
        memo: GOKOKUJINJA_MEMO,
        visitTime: t(9, 57),
        stayDurationMin: 20,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      create: {
        name: "縮景園",
        address: "広島県広島市中区上幟町2-11",
        lat: 34.4003377,
        lng: 132.4674494,
        memo: SHUKKEIEN_MEMO,
        visitTime: t(10, 27),
        stayDurationMin: 75,
        transitMode: "walk",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
    {
      create: {
        name: "広島県立美術館",
        address: "広島県広島市中区上幟町2-22",
        lat: 34.3999676,
        lng: 132.4661219,
        memo: KENBI_MEMO,
        visitTime: t(11, 44),
        stayDurationMin: 65,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      create: {
        name: "本通商店街",
        address: "広島県広島市中区本通",
        lat: 34.3938202,
        lng: 132.4569738,
        memo: HONDORI_MEMO,
        visitTime: t(13, 3),
        stayDurationMin: 50,
        transitMode: "walk",
        transitDurationMin: 14,
        transitLine: null,
      },
    },
    {
      create: {
        name: "頼山陽史跡資料館",
        address: "広島県広島市中区袋町5-15",
        lat: 34.3913945,
        lng: 132.4572833,
        memo: RAISANYO_MEMO,
        visitTime: t(13, 57),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
    {
      create: {
        name: "比治山公園",
        address: "広島県広島市南区比治山公園",
        lat: 34.3847214,
        lng: 132.4726813,
        memo: HIJIYAMA_MEMO,
        visitTime: t(14, 59),
        stayDurationMin: 30,
        transitMode: "train",
        transitDurationMin: 22,
        transitLine: "広島電鉄",
      },
    },
    {
      create: {
        name: "広島市現代美術館",
        address: "広島県広島市南区比治山公園1-1",
        lat: 34.386388,
        lng: 132.4733314,
        memo: MOCA_MEMO,
        visitTime: t(15, 32),
        stayDurationMin: 65,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
  ];

  await setDaySpotOrder(day2Id, day2Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

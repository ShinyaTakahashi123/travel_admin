/**
 * #34(強羅温泉でのんびり、箱根美術館と庭園めぐり1泊2日)初日・最終日の見直し。
 *
 * - Day1: 彫刻の森美術館を外す(タイトル・説明文になく、90分の滞在が大きいため)。開始を
 *   9:30→10:45に。強羅公園のあとに「強羅のあたりで昼食」を新設。大涌谷→ガラスの森
 *   美術館・ガラスの森美術館→ポーラ美術館・ポーラ美術館→強羅温泉は、バスの公式時刻表が
 *   見つからなかったためタクシー(OSRM+5)に変更。終わり17:00。
 * - Day2: 成川美術館のあとに「元箱根のあたりで昼食」を新設。箱根神社の点の直しで
 *   成川美術館への区間が9→19分に伸びたため、開始を9:30→9:00に。長安寺→箱根神社も
 *   バスの公式時刻表が見つからずタクシーに変更。成川美術館65→55・箱根関所60→50に短縮
 *   (決まり369、もと以下)。終わり16:38(もとと完全一致、1泊2日の最終日はもとより遅く
 *   しない決まり)。
 * - 座標はOSM(Nominatim・生のOSM API)の値にそろえた: 箱根美術館way1054387277、
 *   強羅公園→「箱根強羅公園熱帯植物園」node9938928795、早雲山駅way1385721328、
 *   大涌谷→大涌谷駅way240474980(谷の面の中心は不可のため)、箱根ガラスの森美術館→
 *   「ヴェネチアン・グラス美術館」way1494104454の建物中心、ポーラ美術館way388180518、
 *   長安寺node2525570245、箱根神社way553740875、箱根旧街道杉並木→「葭原久保一里塚」
 *   node4652538485(案内板は不可、名前のある道way34124013の近接頂点でrouted-footの
 *   異常値が出たため、近くの一里塚に)、元箱根港node391224913、箱根駅伝ミュージアム
 *   node4434157542、箱根関所way772690985、恩賜箱根公園→「湖畔展望館」node391237969
 *   (公園の面の中心は不可のため)、強羅温泉→強羅駅way1415683341(広い温泉地で同名の
 *   点がないため、しおりで歩き始める駅の点に。決まり361)。
 * - 成川美術館はOSMに一致なし、地理院の住所検索も大字(元箱根)止まりで番地(570)まで
 *   解決できなかったため、現在値を維持(#21と同じ「1件ずつの例外」、企画運営に確認依頼)。
 *   箱根町港もOSMに良い一致がなく変更なし。
 *
 * 出典:
 * - ケーブルカー(強羅〜早雲山)約10分: https://www.hakonenavi.jp/hakone-tozan/
 * - ロープウェイ(早雲山〜大涌谷)約10分: https://www.hakonenavi.jp/hakone-ropeway/
 * - 遊覧船(箱根町港〜元箱根港)約10分: https://tabi-mag.jp/kn0173/ (逆方向も同区間・同所要)
 * - バス路線の区間所要時間は公式・駅探・NAVITIME・Yahoo!いずれも見つからず、タクシー
 *   (OSRM+5)に変更
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-34-657f4a15.ts
 *   反映: npm run prod -- npx tsx prisma/fix-34-657f4a15.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "657f4a15-8f20-4d44-ac20-fa757f002d63";
const DAY1_ID = "ca41802e-c905-41c2-abc2-44d10bbb3c4b";
const DAY2_ID = "9b0cbac9-8d70-4eef-a8dc-242c7d3a6522";

// Day1
const MUSEUM = "5bcc4d93-f84f-4220-8f9e-10a24f01db75";
const GORAPARK = "628cdf0d-097e-4ee2-9831-53a22f8a3102";
const CHOKOKU = "910deb0e-a899-48cb-a101-9ca61d0a1507"; // 外す
const SOUNZAN = "85fe6b0d-8faf-4a1f-a73e-0b3f7370e29f";
const OWAKUDANI = "1b501e9a-c39d-406b-ace9-ed91a9717be5";
const GLASSNOMORI = "34b241d8-1653-4a11-a36e-0cbbb531e686";
const POLA = "24a6970d-413b-46ed-a419-76281978b78d";
const GORAONSEN = "fc5e5edc-d294-4042-b636-176283064a76";

// Day2
const CHOANJI = "a1432995-7481-44d9-9d62-8381472c1471";
const JINJA = "0a285b65-0c46-42ce-9b74-29db3c3608ce";
const NARUKAWA = "0e6b3d0f-b48b-41dd-a170-c69f292dea72";
const SUGINAMIKI = "e780a452-83ff-4280-bba4-0947b926776c";
const MOTOHAKONEKO = "f22acc13-7c76-4477-a911-d650e14941ed";
const HAKONEMACHIKO = "37e757ef-59c2-4d97-9926-f971a9b0a0de";
const EKIDEN = "098da4a6-621a-4671-b936-f323f9cd9e7e";
const SEKISHO = "fc8689df-4801-4f5f-931c-38f5cbac1c56";
const ONSHIKOEN = "96f93780-8bb2-467d-a1c4-e763e868fbdb";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const commit = process.argv.includes("--commit");

  let preview = "";
  await prisma
    .$transaction(
      async (tx) => {
        // ===== Day1 =====
        await setDaySpotOrder(
          DAY1_ID,
          [
            {
              id: MUSEUM,
              data: {
                visitTime: t(10, 45),
                stayDurationMin: 45,
                lat: 35.2481924,
                lng: 139.0427072,
                memo: "1日目は、強羅駅に10時36分ごろ着いたら、歩いておよそ9分の箱根美術館から旅を始めましょう。実業家・岡田茂吉(1882〜1955)が集めた古美術品を紹介する美術館です。岡田茂吉は日本・中国・南アジアなどの古美術品を熱心に収集し、1952年にこの地に美術館を開館させました。敷地『神仙郷』は、岡田茂吉が戦中から戦後にかけて自ら造成したもので、約130種の苔と200本以上のイロハモミジを組み合わせた『苔庭』は、多くの人を魅了する美しさといわれています。館内では、岡田茂吉が集めた陶磁器などの古美術品もあわせて鑑賞できます。改修工事で休館している時期があるので、開館の状況は公式サイトで確かめましょう。この後は、歩いておよそ6分、強羅公園へ向かいましょう。",
                transitLegs: { deleteMany: {} },
              },
            },
            {
              id: GORAPARK,
              data: {
                visitTime: t(11, 36),
                stayDurationMin: 25,
                lat: 35.249126,
                lng: 139.0454129,
                memo: "箱根美術館から歩いておよそ6分の強羅公園は、大正3年（1914年）に開園した、日本で最も古いフランス式整型庭園とされます。斜面地に噴水池や花壇を左右対称に配置した、幾何学的で整然としたデザインが特徴で、開園当初は華族をはじめとする上流階級の人々が親睦や保養のために利用する施設だったと伝えられています。戦後の1957年になって一般に開放され、現在は公園全体が国登録記念物に登録されています。桜やつつじ、あじさい、バラなど、四季を通じて折々の花が楽しめる公園としても親しまれています。園内の『熱帯植物館』には、国内最古といわれる巨大なブーゲンビレアや、日本で初めてとされる熱帯ハーブ専門の温室があり、外の庭園とはまた違った緑の世界を楽しめます。斜面を利用した園内は起伏があるので、歩きやすい靴で散策しましょう。この後は、歩いておよそ7分、強羅のあたりで昼食にしましょう。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6, transitLine: null }] },
              },
            },
            {
              create: {
                name: "強羅のあたりで昼食",
                visitTime: t(12, 8),
                stayDurationMin: 40,
                lat: 35.25066,
                lng: 139.04821,
                memo: "強羅公園から歩いておよそ7分、強羅駅のあたりに着きます。駅のまわりには食事処が並んでいます。お店を選んで、ゆっくり昼食をとりましょう。この後は、ケーブルカーでおよそ10分の早雲山駅へ向かいましょう。",
                transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7, transitLine: null }] },
              },
            },
            {
              id: SOUNZAN,
              data: {
                visitTime: t(12, 58),
                stayDurationMin: 15,
                memo: "強羅駅からケーブルカーでおよそ10分、ロープウェイの起点、早雲山駅に着きます。駅舎2階の「cu-mo箱根」には展望テラスと足湯があり、強羅の町並みや、晴れた日には相模湾まで見渡すパノラマを楽しめます。足湯につかりながら、これから向かう大涌谷への空中散歩に思いをはせてみましょう。この後は、ロープウェイでおよそ10分、大涌谷へ向かいましょう。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "train", transitDurationMin: 10, transitLine: null }] },
              },
            },
            {
              id: OWAKUDANI,
              data: {
                visitTime: t(13, 23),
                stayDurationMin: 40,
                lat: 35.2444182,
                lng: 139.0195759,
                memo: "早雲山駅からロープウェイでおよそ10分、大涌谷に着きます。およそ3,000年前の箱根山の水蒸気爆発によってできた爆裂火口跡で、今も白い噴煙が立ちのぼり、あたりには硫黄の匂いが漂っています。ロープウェイの車窓からは、噴気を上げる谷の様子とともに、天気が良ければ富士山の姿も望めます。大涌谷の散策エリアに立ち入る際は、事前にウェブサイトから予約が必要なので、訪れる前に確かめておきましょう。火山ガスが出ているので、ぜんそくや心臓などに持病のある人は気をつけ、立ち入りの規制は公式の案内で確かめましょう。この後は、タクシーでおよそ18分、箱根ガラスの森美術館へ向かいましょう。タクシーは、前もって予約しておくと安心です。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "other", transitDurationMin: 10, transitLine: null }] },
              },
            },
            {
              id: GLASSNOMORI,
              data: {
                visitTime: t(14, 21),
                stayDurationMin: 40,
                lat: 35.2663317,
                lng: 139.0177738,
                memo: "大涌谷からタクシーでおよそ18分、仙石原の緑に囲まれた箱根ガラスの森美術館に着きます。ヴェネチアン・グラスを専門に紹介する美術館で、15世紀から19世紀にかけてのヴェネチアングラスの名品や、現代作家によるガラス作品を展示しています。庭園からエントランスへと続く橋には、高さおよそ9m、全長およそ10mのクリスタル・ガラスのアーチが架けられており、およそ16万粒のガラスが箱根の風にゆれてさまざまな表情を見せてくれます。ガラス細工の体験工房も併設されているので、時間があれば挑戦してみましょう。この後は、タクシーでおよそ8分、ポーラ美術館へ向かいましょう。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 18, transitLine: null }] },
              },
            },
            {
              id: POLA,
              data: {
                visitTime: t(15, 9),
                stayDurationMin: 50,
                memo: "箱根ガラスの森美術館からタクシーでおよそ8分、仙石原の森の中にあるポーラ美術館に着きます。印象派から現代アートまで、国内外の絵画や工芸品を幅広く所蔵する私立美術館で、ガラス張りの開放的な建物が、周囲のブナ林と一体となった景観を作り出しています。展示だけでなく、建物と森を一緒に楽しめる遊歩道も整備されており、芸術と自然の両方を味わえる場所です。この後は、タクシーでおよそ16分、今夜の宿がある強羅温泉へ向かいましょう。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8, transitLine: null }] },
              },
            },
            {
              id: GORAONSEN,
              data: {
                visitTime: t(16, 12),
                stayDurationMin: 45,
                lat: 35.250657,
                lng: 139.048213,
                memo: "ポーラ美術館からタクシーでおよそ13分、箱根の温泉街の一つ、強羅温泉に着きます。この温泉地は、明治27年（1894年）に早雲山からの引き湯によって温泉開発が始まるまでは、家一軒ない草原地帯だったと伝えられています。大正8年（1919年）に箱根登山鉄道が開通すると、温泉付きの別荘地として分譲が進み、次第に温泉地としての姿を整えていきました。箱根十七湯と呼ばれる箱根の温泉地の中では、比較的新しく開かれた温泉地です。その後、昭和27年（1952年）に初めて温泉の掘削に成功し、以後、独自の源泉が次々と発見されていったといわれています。『強羅』という地名の由来には、岩石が積み重なった傾斜地で石がごろごろしていることから来たという説のほか、サンスクリット語（梵語）で『石の地獄』を意味する言葉に由来するという説も伝えられています。今夜の宿にチェックインしたら、ケーブルカーや宿からの夜景を楽しみながら、湯につかって明日への英気を養いましょう。浴場ではほかの入浴客を撮らないようにしましょう。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 13, transitLine: null }] },
              },
            },
          ],
          { remove: [CHOKOKU], tx }
        );

        // ===== Day2 =====
        await setDaySpotOrder(
          DAY2_ID,
          [
            {
              id: CHOANJI,
              data: {
                visitTime: t(9, 0),
                stayDurationMin: 30,
                lat: 35.2734695,
                lng: 139.0128353,
                memo: "強羅温泉で一泊した二日目は、宿からタクシーでおよそ16分、仙石原にある長安寺からスタートです。タクシーは、前もって予約しておくと安心です。長安寺は延文元年（1356年）、大涌谷のふもと、現在の姥子付近に小さなお堂として建立されたのが始まりと伝えられています。その後、江戸時代になってから現在の仙石原の地に移され、改めて開山したといわれています。境内には、一体ずつ表情の異なる石仏が数多く点在する『五百羅漢』があり、じっくりと見比べながら歩くのも楽しみ方の一つです。思わず笑ってしまうようなユーモラスな表情の羅漢像や、どこか自分に似た顔を探してみるのも一興です。紅葉の名所としても知られ、例年11月中旬から下旬ごろになると、イロハモミジやケヤキ、ブナなどが色づき、境内を美しく彩ります。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、タクシーでおよそ24分、芦ノ湖のほとりにある箱根神社へと向かいましょう。",
                transitLegs: { deleteMany: {} },
              },
            },
            {
              id: JINJA,
              data: {
                visitTime: t(9, 54),
                stayDurationMin: 45,
                lat: 35.2039731,
                lng: 139.0255832,
                memo: "長安寺からタクシーでおよそ24分、芦ノ湖のほとりに鎮座する箱根神社に着きます。天平宝字元年（757年）に万巻上人が創建したと伝えられる古社で、古くから箱根の山岳信仰の中心として、また交通安全・心願成就の神として崇敬を集めてきました。湖上に立つ「平和の鳥居」は、芦ノ湖と富士山を背景にした撮影スポットとしても知られています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ19分の成川美術館へ向かいましょう。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 24, transitLine: null }] },
              },
            },
            {
              id: NARUKAWA,
              data: {
                visitTime: t(10, 52),
                stayDurationMin: 55,
                lat: 35.1999774,
                lng: 139.030974,
                memo: "箱根神社から歩いておよそ13分、成川美術館に着きます。芦ノ湖と富士山を望む高台に建つ日本画専門の美術館で、平山郁夫をはじめとする現代日本画の名品を数多く所蔵しています。ガラス張りの展望ラウンジからは、芦ノ湖の絶景を眺めながらひと息つくこともできます。絵画鑑賞と芦ノ湖の景色の両方を楽しめる場所です。この後は、歩いておよそ5分、杉並木沿いの一里塚のあたりへ向かいましょう。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 13, transitLine: null }] },
              },
            },
            {
              id: SUGINAMIKI,
              data: {
                visitTime: t(11, 52),
                stayDurationMin: 45,
                lat: 35.1992638,
                lng: 139.0299524,
                memo: "成川美術館から歩いておよそ5分、箱根旧街道杉並木に着きます。江戸時代、東海道を行き交う旅人を強い日差しや雪から守るために植えられたと伝えられる杉並木で、樹齢400年近い大杉が今も往時の街道の面影を伝えています。沿道には、一里(約4km)ごとに旅人の目印として築かれた塚の一つ、葭原久保一里塚も残っています。当時の石畳の一部も残る道を、静かな杉木立に包まれながら歩けば、江戸の旅人になった気分を味わえます。この後は、歩いておよそ5分、元箱根のあたりで昼食にしましょう。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
              },
            },
            {
              create: {
                name: "元箱根のあたりで昼食",
                visitTime: t(12, 42),
                stayDurationMin: 40,
                lat: 35.200869,
                lng: 139.030627,
                memo: "箱根旧街道杉並木から歩いておよそ5分、元箱根のあたりに着きます。港のまわりには食事処が並んでいます。お店を選んで、ゆっくり昼食をとりましょう。この後は、歩いておよそ1分の元箱根港へ向かいましょう。",
                transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
              },
            },
            {
              id: MOTOHAKONEKO,
              data: {
                visitTime: t(13, 23),
                stayDurationMin: 10,
                lat: 35.200948,
                lng: 139.0305313,
                memo: "元箱根のあたりから歩いておよそ1分、元箱根港に着きます。ここから芦ノ湖遊覧船に乗り、湖上から景色を楽しみましょう。港からは、湖畔に立つ箱根神社の「平和の鳥居」を湖の上から眺められるほか、天気が良ければ、芦ノ湖の向こうに富士山の姿を望むこともできます。乗り場で少し待ったのち、箱根町港までのおよそ10分間の船旅です。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 1, transitLine: null }] },
              },
            },
            {
              id: HAKONEMACHIKO,
              data: {
                visitTime: t(13, 43),
                stayDurationMin: 20,
                memo: "元箱根港から遊覧船でおよそ10分、箱根町港に着きます。船を降りたら、湖畔の遊歩道を少し歩いてみましょう。山側から歩いてきた元箱根のあたりを、今度は湖の上から眺めた余韻とともに振り返ることができます。この後は、歩いておよそ5分の箱根駅伝ミュージアムへ向かいましょう。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "other", transitDurationMin: 10, transitLine: null }] },
              },
            },
            {
              id: EKIDEN,
              data: {
                visitTime: t(14, 8),
                stayDurationMin: 30,
                lat: 35.1893905,
                lng: 139.0248679,
                memo: "箱根町港から歩いておよそ5分、箱根駅伝ミュージアムに着きます。芦ノ湖のほとりに立つミュージアムで、箱根駅伝の歴代大会の名シーンを記録した写真や、選手が愛用した品々などを展示しています。旅の終盤に、箱根の山々を舞台にした駅伝の歴史にふれましょう。営業時間は曜日によって異なるので、訪れる前に公式サイトで確かめましょう。この後は、歩いておよそ5分、箱根関所へ向かいましょう。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
              },
            },
            {
              id: SEKISHO,
              data: {
                visitTime: t(14, 43),
                stayDurationMin: 50,
                lat: 35.1922057,
                lng: 139.0263526,
                memo: "箱根駅伝ミュージアムから歩いておよそ5分、箱根関所に着きます。江戸時代、東海道の要衝として「入り鉄砲に出女」を取り締まった関所を復元した史跡で、当時の建物のようすを間近で見ることができます。冬の時期(12月〜2月)は閉まる時間が早くなるので、訪れる前に公式サイトで確かめましょう。この後は、歩いておよそ8分、恩賜箱根公園へ向かいましょう。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
              },
            },
            {
              id: ONSHIKOEN,
              data: {
                visitTime: t(15, 41),
                stayDurationMin: 55,
                lat: 35.1962174,
                lng: 139.0260842,
                memo: "箱根関所から歩いておよそ8分、旅の締めくくりは恩賜箱根公園です。かつて皇室の避暑地として使われた離宮の跡地を整備した公園で、湖畔展望館からは、湖の向こうに富士山を望む景色が広がります。園内の施設によっては閉まる時間が早いこともあるので、公式サイトで確かめておくと安心です。長安寺から箱根神社、成川美術館、芦ノ湖遊覧船とめぐった箱根の旅も、ここでゆっくりと締めくくりましょう。この後は、タクシーでおよそ26分の箱根湯本駅へ向かいましょう。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8, transitLine: null }] },
              },
            },
          ],
          { tx }
        );

        const days = await tx.day.findMany({
          where: { itineraryId: ITINERARY_ID },
          orderBy: { dayNumber: "asc" },
          include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } },
        });
        const hm = (dt: Date | null) => (dt ? `${String(dt.getUTCHours()).padStart(2, "0")}:${String(dt.getUTCMinutes()).padStart(2, "0")}` : "?");
        for (const d of days) {
          preview += `\n=== Day ${d.dayNumber} ===\n`;
          for (const s of d.spots) {
            const legs = s.transitLegs.map((l) => `${l.transitMode}/${l.transitDurationMin}`).join("+") || "-";
            preview += `[${s.orderNo}] ${hm(s.visitTime)} ${legs} ${s.name}(${s.stayDurationMin}分) lat=${s.lat} lng=${s.lng}\n`;
          }
        }

        if (!commit) {
          throw new Error("DRY_RUN_ROLLBACK");
        }
      },
      { timeout: 60000 }
    )
    .catch((e) => {
      if (e instanceof Error && e.message === "DRY_RUN_ROLLBACK") {
        console.log("[確認モード] --commit を付けずに実行したため、書き込みは行っていません(ロールバックしました)。以下はロールバック前の実際の計算結果です。");
        return;
      }
      throw e;
    });

  console.log(preview);

  if (commit) {
    console.log("[--commit] 書き込みました。");
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

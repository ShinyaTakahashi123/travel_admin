/**
 * 73f0b468(松島湾遊覧船と福浦橋、島めぐりの絶景クルーズプラン)の点ごと組み直し(2回目送付)
 *
 * 【決まった点(企画運営・法務 11/04〜11/05、/api/0.6/node/<ID>で名前・形を確認)】
 * - 西行戻しの松公園: 名前のある入口・案内所がないため、園内の「白衣観音展望台」
 *   tourism=viewpoint node11664888043 38.366054,141.053033(メモにも出てくる名前)
 * - 雄島: 面の中心ではなく、メモの「赤い橋を渡って島に入り」の渡月橋の陸側の端
 *   way206923338 node6183950138 38.365329,141.061934(反対の端2169923532は島側)
 * - 観瀾亭: ほかの2本(e58458ef・76211b51)と同じ点にそろえる。OSM「観瀾亭」
 *   node5146980821 38.369351,141.061699(タグはamenity=cafeだが、県の文化財の建物の
 *   名前として行き先にしてよい決定済み。メモで茶・抹茶など品や値段にはふれない)
 * - 福浦橋: way206923340の陸側の端 node2169923607 38.370083,141.068158
 *   (反対の端1197722117が島側)
 * - 昼食の点: 松島海岸レストハウス(店が入った建物)は使わない(企画運営 11/05)。
 *   JR松島海岸駅の駅点 node3570916495 38.367849,141.058996(name=松島海岸・
 *   railway=station。店ではない公共の点)を使い、行き先の名前は「松島海岸のあたりで昼食」
 *
 * 【区間(routing.openstreetmap.de routed-foot。歩きはceil、車は使っていない)】
 * JR松島海岸駅→西行戻しの松公園(展望台): 1022.4秒→18分
 * 西行戻しの松公園→天麟院: 1355.9秒→23分(もとの点のまま瑞巌寺へ直行だと25.3秒=26分で
 *   25分の壁を超えるため、天麟院を先にする順番に変更。企画運営 11/05)
 * 天麟院→瑞巌寺: 229.2秒→4分
 * 瑞巌寺→円通院: 167.4秒→3分
 * 円通院→五大堂: 本番の今の点(38.371289,141.05996→38.369724,141.064208)で測り直し
 *   488.9秒→9分(1回目送付の5分は、古い点のままの測り間違い。法務 11/05の指摘で直した)
 * 五大堂→雄島(渡月橋): 865.6秒→15分
 * 雄島(渡月橋)→JR松島海岸駅: 399.8秒→7分
 * JR松島海岸駅→観瀾亭(決まった点): 278.8秒→5分
 * 観瀾亭(決まった点)→松島湾遊覧船(桟橋): 550.4秒→10分(もとの点38.369701,141.062378
 *   だと257.5秒=4分だったが、決まった点に変えたことで伸びる)
 * 松島湾遊覧船(桟橋)→福浦橋(決まった点): 229.6秒→4分
 * 福浦橋(決まった点)→JR松島海岸駅: 845.1秒→15分(閉じの文のみ。区間レコードではない)
 *
 * 【松島湾遊覧船の時刻】仁王丸コース(50分)の公式時刻表
 * https://www.matsushima.or.jp/timesheet/ (確認2026-11-05。運航会社のサイトなので、
 * 時刻の根拠にのみ使う。法務 11/05)は9:00発から1時間おき。観瀾亭を14:10着・滞在35分で
 * 14:45発、桟橋まで歩き10分で14:55着のため、15:00発に乗る。乗船の手続きの余裕をとり、
 * 桟橋での待ち5分を区間(transitMode: other)として記録する(企画運営 11/05)。
 * メモには会社名・コース名・料金・出航時刻を書かず、「便の時刻は公式で確かめましょう」とする
 * (法務・企画運営 11/05)。
 *
 * 【始まりの時刻】8:47(決まりの範囲8:30〜9:30の中)。昼食は13:25に始まり、13:30までに収まる。
 *
 * 【出典(法務 11/05の指摘で、事実ごとに公式・観光協会の出典をつけた)】
 * - 瑞巌寺(天長5年・828・慈覚大師が前身の延福寺を開創・慶長14年・1609に政宗が5年かけて
 *   完成・本堂と庫裡及び廊下が国宝): https://zuiganji.or.jp/history/ (瑞巌寺公式、確認2026-11-05)
 * - 瑞巌寺の参道の洞窟群: https://www.mlit.go.jp/tagengo-db/H30-00219.html
 *   (国土交通省多言語解説、確認2026-11-05)
 * - 円通院(伊達光宗を偲んで正保4年(1647)に建立。1回目送付の「正保2年(1645)」は光宗の
 *   没年で、建立年ではなかったため直した。石庭は松島湾の島々を模す。厨子のバラなどの絵柄は
 *   政宗が1615年にローマへ送った使節の影響とされる。「4つの庭園」「日本最古の西洋バラ」
 *   「光宗の死因」は出典がないため削除): https://www.mlit.go.jp/tagengo-db/common/001557154.pdf
 *   (国土交通省多言語解説、確認2026-11-05)
 * - 五大堂(大同2年(807)、坂上田村麻呂が毘沙門堂を建立。「すかし橋」は橋桁の間から波が
 *   透けて見える。1回目送付の「床板の隙間から海面が見える」は表現が違ったため直した):
 *   https://www.town.miyagi-matsushima.lg.jp/page/1199.html (松島町公式、確認2026-11-05)
 * - 五大堂(慶長9年(1604)伊達政宗の創建。「仙台圏内における最古の桃山建築」。1回目送付の
 *   「東北地方に現存する最古」は言い過ぎだったため直した):
 *   https://www.pref.miyagi.jp/soshiki/bunkazai/03godaidou.html (宮城県公式、確認2026-11-05)
 * - 五大堂(円仁(慈覚大師)が五大明王を安置・重要文化財):
 *   https://www.mlit.go.jp/tagengo-db/common/001551739.pdf (国土交通省多言語解説、確認2026-11-05)
 * - 観瀾亭(豊臣秀吉から伊達政宗が譲り受けた伏見城の建物を、2代藩主・忠宗がこの地に移し、
 *   5代藩主・伊達吉村が「観瀾亭」と命名。「藩主一族の松島遊覧」「幕府からの巡見使の接待」は
 *   出典がないため削除): https://www.pref.miyagi.jp/soshiki/bunkazai/ken-01kanrantei.html
 *   (宮城県公式、確認2026-11-05)
 * - 観瀾亭に隣接する松島博物館(伊達家ゆかりの品々を展示):
 *   https://www.mlit.go.jp/tagengo-db/R2-01044.html (国土交通省多言語解説、確認2026-11-05)
 * - 西行戻しの松公園(西行法師が童子との禅問答に敗れ松島行きを断念した言い伝え。
 *   「金華山まで見渡せる」は出典がないため削除、「松島湾に浮かぶ島々を見渡せます」にとどめた):
 *   https://www.town.miyagi-matsushima.lg.jp/page/1267.html (松島町公式、確認2026-11-05)
 * - 天麟院(伊達政宗の娘・五郎八姫の菩提寺。松平忠輝との結婚と改易・離縁。政宗が娘の信仰生活
 *   を支えた。陽徳院・円通院とあわせて「松島三霊廟」):
 *   https://www.matsushima-kanko.com/miru/detail.php?id=145 (松島観光協会公式、確認2026-11-05)
 * - 雄島(かつて修行の島で、およそ50の岩窟が残り、さまざまな形式の板碑も見つかっている。
 *   「名の由来の説」「芭蕉の句碑」は出典がないため削除):
 *   https://www.town.miyagi-matsushima.lg.jp/page/1661.html (松島町公式、確認2026-11-05)
 * - 松島湾遊覧船(松島が「日本三景」の一つ。芭蕉が奥州をめぐる旅の目的の一つとして訪れた。
 *   「林春斎」「おくのほそ道」は出典がないため削除):
 *   https://www.matsushima-kanko.com/miryoku/ (松島観光協会公式、確認2026-11-05)
 * - 松島湾遊覧船(仁王島という奇岩の名前): https://www.matsushima-kanko.com/miru/detail.php?id=153
 *   (松島観光協会公式、確認2026-11-05)
 * - 福浦橋(全長252メートルの朱塗りの橋。「素敵な出会いが訪れるとされ」「出会い橋」の愛称):
 *   https://www.town.miyagi-matsushima.lg.jp/page/1578.html (松島町公式、確認2026-11-05)
 * - 福浦島(自然植物公園。赤松・杉・モミなどおよそ250種の草木。遊歩道。「県立自然公園」
 *   「見晴台」は出典がないため削除): https://www.town.miyagi-matsushima.lg.jp/page/1582.html
 *   (松島町公式、確認2026-11-05)
 *
 * 【祈りの一文】itinerary-rules.md 241行目の決まりの一文
 * 「今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。」に、
 * 瑞巌寺・天麟院・円通院・五大堂をそろえる(法務 11/05「新しく書く・直す文はしましょうにそろえる」)
 *
 * 【雄島】死にふれない書き方にするため、供養・句碑にふれる文を外し、
 * 「雄島のまわりでは、静かに過ごしましょう。」に直す(法務・企画運営 11/05)
 *
 * 【順番の入れかえにともなう orderNo の付け替え】
 * 天麟院(3→2)・瑞巌寺(2→3)はunique(dayId,orderNo)にぶつからないよう、
 * 天麟院を一時的に99にしてから瑞巌寺を3に、そのあと天麟院を2にする。
 * 観瀾亭(7→8)・松島湾遊覧船(8→9)・福浦橋(9→10)は、新しい昼食スポットを7に
 * 入れる場所を空けるため、後ろから先に動かす。
 *
 * 確認: 法務・企画運営(3回目送付。1回目のsha256 1f3ce1b1…から、円通院→五大堂の区間・
 * 円通院の文・出典・始まりの時刻・遊覧船の待ちを直した。2回目のsha256 66140299…から、
 * 出典で確かめられなかった3つの言い回し(瑞巌寺「奥州随一」・公園「白衣観音展望台」・
 * 雄島「260余りの代表的な島」)を、出典どおりの言い方に直した。法務 11/05)
 */

import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "73f0b468-46de-471e-9d7c-4e24bf3e1b10";
const DAY_ID = "cf7b9a36-5e6e-4964-97b4-7aea22a81f90";

function t(h: number, m: number): Date {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const PARK_ID = "5f8c2ec7-1816-4e8c-9d74-ddca694a037d";
const TENRININ_ID = "67cda433-265c-4df9-95f0-60e956abccc5";
const ZUIGANJI_ID = "d3fd02b7-4fc2-4034-8b18-6e7299f5d8de";
const ENTSUIN_ID = "06ed0e33-bf60-4142-a694-695d896b3368";
const GODAIDO_ID = "cd310554-0b8e-4d38-ac38-015ea4379d49";
const YUSHIMA_ID = "c53e0351-0b18-4859-9c9f-22296f990d88";
const LUNCH_ID = "f2ac372e-17b8-429b-8eca-68742e73a180";
const KANRANTEI_ID = "cf71a9fe-d3e4-4e8c-9e3d-efba08427b7c";
const CRUISE_ID = "7dc1726a-b7a5-4d80-95ea-d67f1bb1eadc";
const FUKUURA_ID = "b2553fd1-6fcf-41c3-88e5-e99c5c8e78b2";

const SPOTS: {
  id: string;
  name: string;
  orderNo: number;
  visitTime: Date;
  stayDurationMin: number;
  lat?: string;
  lng?: string;
  memo: string;
  legs: { orderNo: number; transitMode: string; transitDurationMin: number }[];
}[] = [
  {
    id: PARK_ID,
    name: "西行戻しの松公園",
    orderNo: 1,
    visitTime: t(8, 47),
    stayDurationMin: 25,
    lat: "38.366054",
    lng: "141.053033",
    memo:
      "この旅は、歩いてめぐります。JR松島海岸駅からは、坂を上って徒歩およそ18分です。西行戻しの松公園は、松島湾を見下ろす高台にある公園で、園内の頂上の展望台からは、松島湾に浮かぶ島々を見渡せます。歌人・西行法師が諸国を旅する途中、この地で出会った童子との禅問答に敗れ、松島行きを断念したという言い伝えが、公園の名の由来です。松島の旅の始まりに、まずは高台から全景を眺めてみましょう。この後は、歩いておよそ23分、天麟院へ向かいましょう。",
    legs: [],
  },
  {
    id: TENRININ_ID,
    name: "天麟院",
    orderNo: 2,
    visitTime: t(9, 35),
    stayDurationMin: 32,
    memo:
      "西行戻しの松公園からは歩いておよそ23分です。天麟院は、伊達政宗の娘・五郎八姫の菩提寺です。五郎八姫は徳川家康の六男・松平忠輝に嫁ぎましたが、忠輝が改易されたことから離縁され、仙台へ戻って仏門に入ったと伝わります。政宗は、不運な娘を思いやり、その信仰生活を支えたといわれています。陽徳院・円通院とあわせて「松島三霊廟」の一つに数えられる、静かな寺院です。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ4分、瑞巌寺へ向かいましょう。",
    legs: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 23 }],
  },
  {
    id: ZUIGANJI_ID,
    name: "瑞巌寺",
    orderNo: 3,
    visitTime: t(10, 11),
    stayDurationMin: 60,
    memo:
      "天麟院からは歩いておよそ4分です。瑞巌寺は、天長5年(828)、慈覚大師によって創建されたと伝わる禅寺です。仙台藩祖・伊達政宗の菩提寺として知られ、現在の建物は慶長14年(1609)、政宗が桃山様式の粋を尽くし、5年の歳月をかけて完成させたものです。本堂・庫裡及び廊下は国宝に指定されており、豪華な内部装飾や障壁画、伊達家ゆかりの品々の数々を見ることができます。松林と石畳の参道沿いには洞窟群も残ります。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ3分、円通院へ向かいましょう。",
    legs: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }],
  },
  {
    id: ENTSUIN_ID,
    name: "円通院",
    orderNo: 4,
    visitTime: t(11, 14),
    stayDurationMin: 45,
    memo:
      "瑞巌寺からは歩いておよそ3分です。円通院は、仙台藩2代藩主・伊達忠宗の次男・伊達光宗を偲んで、正保4年(1647)に建てられた寺です。境内には、松島湾の島々を模した石庭や、バラ園などがあります。重要文化財「三慧殿」の厨子に描かれたバラなどの絵柄は、伊達政宗が1615年にローマへ送った使節の影響を受けているとされます。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ9分、五大堂へ向かいましょう。",
    legs: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }],
  },
  {
    id: GODAIDO_ID,
    name: "五大堂",
    orderNo: 5,
    visitTime: t(12, 8),
    stayDurationMin: 25,
    memo:
      "円通院からは歩いておよそ9分です。五大堂は、大同2年(807)、坂上田村麻呂が東征の折に毘沙門堂を建てたのが始まりとされ、のちに慈覚大師が五大明王像を安置したことから、五大堂と呼ばれるようになりました。現在のお堂は慶長9年(1604)、伊達政宗によって建立されたもので、仙台圏内に現存する最古の桃山建築とされ、国の重要文化財に指定されています。海に浮かぶ小島に建つお堂へは、橋桁の間から波が透けて見える「すかし橋」を渡っていきます。足元に気をつけましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ15分、雄島へ向かいましょう。",
    legs: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }],
  },
  {
    id: YUSHIMA_ID,
    name: "雄島",
    orderNo: 6,
    visitTime: t(12, 48),
    stayDurationMin: 30,
    lat: "38.365329",
    lng: "141.061934",
    memo:
      "五大堂からは歩いておよそ15分です。雄島は、かつては修行の島として知られ、島内にはおよそ50の岩窟が残り、壁には卒塔婆を彫りつけた跡があります。さまざまな形式の板碑も見つかっています。岩場や海沿いでは足元に気をつけましょう。赤い橋を渡って島に入り、木々に囲まれた静かな散策路を歩いてみましょう。雄島のまわりでは、静かに過ごしましょう。この後は、歩いておよそ7分、松島海岸のあたりへ向かいましょう。",
    legs: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15 }],
  },
  {
    id: LUNCH_ID,
    name: "松島海岸のあたりで昼食",
    orderNo: 7,
    visitTime: t(13, 25),
    stayDurationMin: 40,
    lat: "38.367849",
    lng: "141.058996",
    memo:
      "雄島からは歩いておよそ7分です。松島海岸のあたりには食事処が多いので、ここで昼食にしましょう。腹ごしらえをしたら、歩いておよそ5分の観瀾亭へ向かいましょう。",
    legs: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }],
  },
  {
    id: KANRANTEI_ID,
    name: "観瀾亭",
    orderNo: 8,
    visitTime: t(14, 10),
    stayDurationMin: 35,
    lat: "38.369351",
    lng: "141.061699",
    memo:
      "松島海岸のあたりからは歩いておよそ5分です。観瀾亭は、もとは豊臣秀吉の伏見城にあった建物で、政宗が譲り受け、2代藩主・忠宗がこの地に移したと伝わります。5代藩主・伊達吉村によって「観瀾亭」と名付けられました。隣接する松島博物館では、伊達家ゆかりの品々が展示されています。伊達家の歴史に思いをはせながら、松島湾の眺めを楽しみましょう。この後は、歩いておよそ10分、松島湾遊覧船へ向かいましょう。",
    legs: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }],
  },
  {
    id: CRUISE_ID,
    name: "松島湾遊覧船",
    orderNo: 9,
    visitTime: t(15, 0),
    stayDurationMin: 55,
    memo:
      "観瀾亭からは歩いておよそ10分です。松島湾遊覧船は、大小260あまりの島々が浮かぶ松島湾を、およそ50分かけて巡ります。松島は「日本三景」の一つに数えられ、俳人・松尾芭蕉も、奥州をめぐる旅の目的の一つとして、この地を訪れました。船が進むにつれて、仁王島など、表情豊かな奇岩の島々が次々と現れます。海の上から、松島湾の全景を眺めてみましょう。便の時刻は公式で確かめましょう。この後は、歩いておよそ4分、福浦橋へ向かいましょう。",
    legs: [
      { orderNo: 1, transitMode: "walk", transitDurationMin: 10 },
      { orderNo: 2, transitMode: "other", transitDurationMin: 5 },
    ],
  },
  {
    id: FUKUURA_ID,
    name: "福浦橋",
    orderNo: 10,
    visitTime: t(15, 59),
    stayDurationMin: 50,
    lat: "38.370083",
    lng: "141.068158",
    memo:
      "松島湾遊覧船からは歩いておよそ4分です。福浦橋は、松島海岸から福浦島へと渡る、全長252メートルの朱塗りの橋です。素敵な出会いが訪れるとされ、「出会い橋」と呼ばれています。福浦島は自然植物公園となっており、赤松や杉、モミなど、およそ250種の草木が茂る遊歩道を歩きながら、遊覧船とはまた違う目線で松島湾の景色を眺めることができます。海の上を歩くように橋を渡りながら、松島の旅を締めくくりましょう。見学を終えたら、JR松島海岸駅までは徒歩およそ15分です。",
    legs: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }],
  },
];

async function main() {
  const commit = process.argv.includes("--commit");
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード ===");

  for (const s of SPOTS) {
    console.log("----");
    console.log("名前:", s.name, "orderNo:", s.orderNo);
    console.log(
      "時刻:",
      `${String(s.visitTime.getUTCHours()).padStart(2, "0")}:${String(s.visitTime.getUTCMinutes()).padStart(2, "0")}`,
      "滞在:",
      s.stayDurationMin,
    );
    if (s.lat && s.lng) console.log("座標(更新):", s.lat, s.lng);
    console.log("memo:", s.memo);
    for (const leg of s.legs) {
      console.log("  区間:", JSON.stringify(leg));
    }
  }

  if (!commit) {
    console.log("\n--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    // orderNoの付け替え(unique(dayId, orderNo)にぶつからない順番)
    await tx.spot.update({ where: { id: FUKUURA_ID }, data: { orderNo: 10 } });
    await tx.spot.update({ where: { id: CRUISE_ID }, data: { orderNo: 9 } });
    await tx.spot.update({ where: { id: KANRANTEI_ID }, data: { orderNo: 8 } });
    await tx.spot.update({ where: { id: TENRININ_ID }, data: { orderNo: 99 } });
    await tx.spot.update({ where: { id: ZUIGANJI_ID }, data: { orderNo: 3 } });
    await tx.spot.update({ where: { id: TENRININ_ID }, data: { orderNo: 2 } });

    for (const s of SPOTS) {
      if (s.id === LUNCH_ID) continue; // 新規は別途create
      const data: Record<string, unknown> = {
        visitTime: s.visitTime,
        stayDurationMin: s.stayDurationMin,
        memo: s.memo,
      };
      if (s.lat && s.lng) {
        data.lat = s.lat;
        data.lng = s.lng;
      }
      await tx.spot.update({ where: { id: s.id }, data });

      // 遊覧船は1回目送付でother区間を作らなかったため、この回でorderNo2がなければ作る。
      // それ以外は既存の区間をupsertで直す
      for (const leg of s.legs) {
        await tx.spotTransitLeg.upsert({
          where: { spotId_orderNo: { spotId: s.id, orderNo: leg.orderNo } },
          create: {
            spotId: s.id,
            orderNo: leg.orderNo,
            transitMode: leg.transitMode,
            transitDurationMin: leg.transitDurationMin,
          },
          update: {
            transitMode: leg.transitMode,
            transitDurationMin: leg.transitDurationMin,
          },
        });
      }
    }

    const lunch = SPOTS.find((s) => s.id === LUNCH_ID)!;
    await tx.spot.create({
      data: {
        id: LUNCH_ID,
        dayId: DAY_ID,
        orderNo: lunch.orderNo,
        name: lunch.name,
        lat: lunch.lat,
        lng: lunch.lng,
        visitTime: lunch.visitTime,
        memo: lunch.memo,
        stayDurationMin: lunch.stayDurationMin,
        stampCategory: "gourmet",
      },
    });
    for (const leg of lunch.legs) {
      await tx.spotTransitLeg.create({
        data: {
          spotId: LUNCH_ID,
          orderNo: leg.orderNo,
          transitMode: leg.transitMode,
          transitDurationMin: leg.transitDurationMin,
        },
      });
    }
  });

  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

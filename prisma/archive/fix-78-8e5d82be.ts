/**
 * #78 8e5d82be（伊根の舟屋と丹後の海を満喫する、1泊2日のんびり漁村旅）
 *
 * 既存はDay1が4か所(09:30〜14:30、4か所要件は満たすが終了が早い)、Day2が3か所
 * (09:30〜12:20、4か所未満・終了とも規定外)。
 *
 * 対応(決まりA、実在するスポットを追加):
 * Day1: 伊根の舟屋(既存)→伊根湾めぐり遊覧船(新規)→舟屋の里公園(既存)→経ヶ岬灯台(既存)→
 * 立岩(新規、丹後町間人)→琴引浜(既存)→夕日ヶ浦海岸(新規、網野町)の7か所09:30〜16:30。
 * Day2: 丹後由良(既存)→由良川橋梁(新規)→智恩寺(既存)→天橋立ビューランド(新規)→
 * 元伊勢籠神社(新規)→傘松公園(新規)→天橋立(既存)の7か所09:30〜16:38。
 *
 * 【企画運営の再指摘・1回目】(1)傘松公園(北側)から歩いて天橋立を渡ると智恩寺そばに
 * 置いた車に戻れない問題を発見。文珠(智恩寺)を先に訪れ、天橋立ビューランド→天橋立観光船
 * (文珠〜一の宮、公式で運航時間確認)で北側へ渡って籠神社・傘松公園を巡り、天橋立を歩いて
 * 文珠へ戻る順に並べ替えて解消。(2)夕日ヶ浦海岸(16時台の最終スポット)の本文から「日が
 * 沈む時間帯は特に美しい」を削除し、夕日を見る前提の書き方にならないよう修正。
 *
 * 座標はNominatim確認。移動はcar/other(ケーブルカー・リフト・観光船)で統一。
 * itinerary-audit・prayer-check確認済み。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const ITIN = "8e5d82be-cacd-43ec-bbb8-29762eca8a07";

async function main() {
  const days = await prisma.day.findMany({
    where: { itineraryId: ITIN },
    orderBy: { dayNumber: "asc" },
    include: { spots: { orderBy: { orderNo: "asc" } } },
  });

  const day1 = days[0];
  const day1Spots: SpotOrderItem[] = [
    { id: "5702fe5d-9a15-4712-93dd-2458a6ca1179", data: { name: "伊根の舟屋", address: "与謝郡伊根町平田", lat: 35.67494, lng: 135.289437, memo: "1階が船のガレージ、2階が住居という、日本を代表する漁村風景です。もとは山の中腹に住居を構えていた集落でしたが、18世紀ごろ、漁をしやすいように海のすぐそばへ移り住むようになったと伝えられています。現在も約230軒の舟屋が軒を連ね、2005年には漁村として全国で初めて、国の重要伝統的建造物群保存地区に選定されました。のんびり歩いて、独特の景観を写真におさめましょう。", visitTime: new Date(Date.UTC(1970,0,1,9,30)), stayDurationMin: 60, transitMode: null, transitDurationMin: null, transitLine: null } },
    { id: "70247481-a970-461b-8ffb-1d5451143dfb", data: { name: "伊根湾めぐり遊覧船", address: "京都府与謝郡伊根町日出", lat: 35.670506, lng: 135.277374, memo: "伊根の舟屋から車でおよそ5分、伊根湾めぐり遊覧船の乗り場に着きます。伊根湾をおよそ25分かけて周遊する船で、海側から舟屋群を眺めることができ、陸から見るのとはまた違った独特の景観を楽しめます。船のあとをついてくるカモメやトビにエサをあげることもでき、大人から子供まで人気の体験です。この後は、車でおよそ7分、舟屋の里公園へ向かいましょう。", visitTime: new Date(Date.UTC(1970,0,1,10,35)), stayDurationMin: 35, transitMode: "car", transitDurationMin: 5, transitLine: null } },
    { id: "6e4c3124-22dd-45b4-943b-314e6e1fb419", data: { name: "舟屋の里公園", address: "与謝郡伊根町平田507", lat: 35.675463, lng: 135.292874, memo: "伊根湾と舟屋群を高台から一望できる展望公園です。道の駅も併設されており、レストランや売店も充実。眼下に広がる約230軒の舟屋の眺めは、伊根ならではの独特な景観をひと目で楽しめる絶好のスポットです。旅の合間に、新鮮な海の幸を味わいながらひと休みしましょう。", visitTime: new Date(Date.UTC(1970,0,1,11,17)), stayDurationMin: 40, transitMode: "car", transitDurationMin: 7, transitLine: null } },
    { id: "b5bf8025-4254-4f4e-baf1-817dcbdbabe2", data: { name: "経ヶ岬灯台", address: "京丹後市丹後町袖志", lat: 35.777139, lng: 135.223361, memo: "日本海に突き出た丹後半島の最北端に立つ、白亜の灯台です。明治31年（1898年）の初点灯以来、行き交う船を見守ってきました。使われているフランス製レンズは重さ5トンで、同規格のレンズを持つ灯台は全国でも犬吠埼・室戸岬などごくわずか。「第1等灯台」に数えられる、貴重な存在です。灯台の建材を切り出した石切り場の跡が、今も足元の海岸に残されています。", visitTime: new Date(Date.UTC(1970,0,1,12,32)), stayDurationMin: 40, transitMode: "car", transitDurationMin: 35, transitLine: null } },
    { id: "f56cecb1-b5df-4591-a5b0-8d0512873fb7", data: { name: "立岩", address: "京都府京丹後市丹後町間人", lat: 35.741117, lng: 135.101704, memo: "経ヶ岬灯台から車でおよそ25分、後ヶ浜海岸にそびえる立岩に着きます。高さはおよそ20mで、1500万年前に地下から噴き出したマグマが冷えて固まってできた柱状の岩です。かつて丹後の国を苦しめた鬼を、朝廷から遣わされた麻呂子親王がこの岩に封じ込めたという伝説が残っており、山陰海岸ジオパークを代表する景観の一つになっています。この後は、車でおよそ12分、琴引浜へ向かいましょう。", visitTime: new Date(Date.UTC(1970,0,1,13,37)), stayDurationMin: 40, transitMode: "car", transitDurationMin: 25, transitLine: null } },
    { id: "b5eb3a4e-4f3a-42fa-91ca-571dc90b77ef", data: { name: "琴引浜", address: "京丹後市網野町掛津", lat: 35.70333, lng: 135.05205, memo: "歩くと「キュッキュッ」と鳴る、全国でも数少ない「鳴き砂」の海岸です。砂の主成分である石英の粒が、きれいな水と空気でよく洗われることで表面の摩擦が大きくなり、力が加わると砂粒同士がまとまって振動し、あの独特の音が生まれるのだそうです。国の天然記念物にも指定される貴重な砂浜、きれいな海を保つためにごみを残さないよう心がけましょう。", visitTime: new Date(Date.UTC(1970,0,1,14,29)), stayDurationMin: 50, transitMode: "car", transitDurationMin: 12, transitLine: null } },
    { id: "0e607273-4823-4e4a-96e5-9a990726d1d2", data: { name: "夕日ヶ浦海岸", address: "京都府京丹後市網野町浜詰", lat: 35.649989, lng: 134.972455, memo: "琴引浜から車でおよそ15分、夕日の名所として知られる夕日ヶ浦海岸に着きます。海沿いの散策路「夕日の路」が整備されていて、木製のビーチブランコ「ゆらり」もあり、近年は写真スポットとしても人気です。白い砂浜と青い日本海のコントラストが美しく、季節を問わず気持ちの良い散策が楽しめます。1日目は、ここで終了です。お疲れさまでした。", visitTime: new Date(Date.UTC(1970,0,1,15,34)), stayDurationMin: 56, transitMode: "car", transitDurationMin: 15, transitLine: null } },
  ];

  const day2 = days[1];
  const day2Spots: SpotOrderItem[] = [
    { id: "a5fd746d-d528-48ba-918b-3162a2658d52", data: { name: "丹後由良", address: "宮津市由良", lat: 35.515908, lng: 135.279514, memo: "2日目は、若狭湾を望む白砂の海水浴場から。森鷗外の小説『山椒大夫』の舞台としても知られ、人買いにさらわれた姉弟・安寿と厨子王が、ここ由良で山椒大夫に仕えさせられたという物語が描かれています。幼い安寿が毎日海水を汲んで運んだとされる「汐汲浜」が、浜の西端に今も残されています。静かな渚を歩きながら、のんびりと物語の舞台に思いをはせてみましょう。", visitTime: new Date(Date.UTC(1970,0,1,9,30)), stayDurationMin: 40, transitMode: null, transitDurationMin: null, transitLine: null } },
    { id: "15b40290-068d-4add-95ec-f094f2d42708", data: { name: "由良川橋梁", address: "京都府宮津市石浦", lat: 35.510924, lng: 135.287882, memo: "丹後由良から車でおよそ5分、由良川の河口に架かる由良川橋梁に着きます。大正13年(1924年)に完成した全長およそ552mの鉄橋で、京都丹後鉄道の丹後由良駅と丹後神崎駅の間を結んでいます。赤さび色に染まった鉄橋を、日本海を背景に列車が渡っていく光景は、鉄道ファンでなくても目を引く絶景として知られています。この後は、車でおよそ20分、智恩寺へ向かいましょう。", visitTime: new Date(Date.UTC(1970,0,1,10,15)), stayDurationMin: 20, transitMode: "car", transitDurationMin: 5, transitLine: null } },
    { id: "5f905174-7b9d-4f8f-8f9b-7ef88ff62e98", data: { name: "智恩寺（文殊堂）", address: "宮津市文珠", lat: 35.558583, lng: 135.183778, memo: "由良川橋梁から車でおよそ20分、天橋立の南のたもと、文珠に着きます。知恵の仏様への参拝です。「切戸の文殊」とも呼ばれる、日本三文殊の一つに数えられる古刹で、寺伝では、混沌とした国土を鎮めるため中国から文殊菩薩を迎えたのが始まりと伝えられています。「三人寄れば文殊の智恵」という言葉はこの寺に由来するとされ、知恵を授かろうと多くの参拝者が訪れます。参拝の際は、敬意を持ってお参りしましょう。車はこの文珠に置いたまま、この後は、天橋立ビューランドのモノレールとリフトでおよそ8分、展望台へ向かいましょう。", visitTime: new Date(Date.UTC(1970,0,1,10,55)), stayDurationMin: 30, transitMode: "car", transitDurationMin: 20, transitLine: null } },
    { id: "810edb51-f216-49c2-9c59-9d91eff63fd4", data: { name: "天橋立ビューランド", address: "京都府宮津市字文珠437", lat: 35.552395, lng: 135.181592, memo: "智恩寺から天橋立ビューランドのモノレールとリフトでおよそ8分、標高およそ130mの展望台に着きます。南側から見る天橋立の眺めは「飛龍観」と呼ばれ、龍が天に飛び立つ姿にたとえられます。ここにも股のぞき台があり、あとで訪れる北側の傘松公園とはまた違った角度から、砂州の全景を楽しむことができます。園内には小さな遊具や展望リフトもあり、ゆっくり過ごせます。この後は、モノレールで文珠へ下り、天橋立観光船に乗り継いでおよそ25分、対岸の一の宮(元伊勢籠神社)へ向かいましょう。", visitTime: new Date(Date.UTC(1970,0,1,11,33)), stayDurationMin: 80, transitMode: "other", transitDurationMin: 8, transitLine: null } },
    { id: "3e2e8d5d-2780-461a-876c-09de7b773d53", data: { name: "元伊勢籠神社", address: "京都府宮津市大垣430", lat: 35.582645, lng: 135.196758, memo: "天橋立ビューランドからモノレールで文珠へ下り、天橋立観光船に乗り継いでおよそ25分、天橋立の北のたもと、一の宮桟橋に着きます。船を降りてすぐ、元伊勢籠神社があります。養老3年(719年)には丹後国の一宮とされた格式ある古社で、伊勢神宮と同じ天照大神・豊受大神をまつっており、伊勢神宮に先立って両神をまつっていたという伝承から「元伊勢」の名で呼ばれています。本殿は伊勢神宮の御正殿と同じ神明造で、高欄に並ぶ五色の座玉という珍しい意匠も、伊勢神宮とこの籠神社でしか見られないとされます。神門前に構える一対の狛犬は鎌倉時代の作と伝わり、国の重要文化財に指定されています。参拝の際は、敬意を持ってお参りしましょう。この後は、天橋立ケーブルカーとリフトでおよそ10分、傘松公園へ向かいましょう。", visitTime: new Date(Date.UTC(1970,0,1,13,18)), stayDurationMin: 55, transitMode: "other", transitDurationMin: 25, transitLine: null } },
    { id: "e72c03ef-93f8-4e58-a165-ae5756d7a891", data: { name: "傘松公園", address: "京都府宮津市大垣", lat: 35.586759, lng: 135.195117, memo: "元伊勢籠神社から天橋立ケーブルカーとリフトでおよそ10分、標高およそ130mの傘松公園に着きます。ここは「股のぞき」発祥の地とされ、頭を下げて股の間から景色をのぞき込むと、天と海が逆転して見え、天橋立がまるで天に架かる橋のように見えることからその名がついたと伝わります。北側から見るこの眺めは「斜め一文字」と呼ばれ、天に昇る龍のようにも見えることから「昇龍観」の別名でも知られています。展望台からゆっくりと、日本三景の一つに数えられる砂州の全景を眺めてみてください。この後は、天橋立ケーブルカーとリフトでおよそ10分、天橋立の松並木へ向かいましょう。", visitTime: new Date(Date.UTC(1970,0,1,14,23)), stayDurationMin: 45, transitMode: "other", transitDurationMin: 10, transitLine: null } },
    { id: "c58a8d21-cd2a-42cf-900b-700362ea5320", data: { name: "天橋立", address: "宮津市文珠〜大垣", lat: 35.569361, lng: 135.191528, memo: "傘松公園から天橋立ケーブルカーとリフトでおよそ10分、白砂青松の松並木の中を歩いて渡ります。『丹後国風土記』には、イザナギノミコトが天と地を結ぶために架けた梯子が倒れてこの姿になったという伝説が記されています。股の間からのぞき込むと、空と海が逆転して見えることから、古くから縁起の良い景観として親しまれてきました。およそ3.6kmにわたる松並木の中を、潮風を感じながらのんびり歩けば、旅の余韻をゆっくり味わえます。歩いた先の文珠には、朝置いた車が待っています。伊根の舟屋から丹後の海辺、天橋立とめぐった、のんびり漁村旅も、ここで無事に終了です。お疲れさまでした。", visitTime: new Date(Date.UTC(1970,0,1,15,18)), stayDurationMin: 80, transitMode: "other", transitDurationMin: 10, transitLine: null } },
  ];

  if (!COMMIT) {
    console.log("確認モードです（このスクリプトは記録用で、現在のDBの状態と一致させるものです。差分が出た場合のみ --commit で書き込みます）");
    console.log("Day1: " + day1Spots.length + "件");
    console.log("Day2: " + day2Spots.length + "件");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

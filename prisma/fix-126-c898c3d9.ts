/**
 * #126 c898c3d9(大洗の海の幸も。水戸から足を延ばす1泊2日満喫旅)の全面
 * 見直し。
 *
 * もとはDay1(水戸)が偕楽園・水戸城跡の2か所のみ、Day2(大洗)が大洗磯前
 * 神社・アクアワールドの2か所のみで、4か所以上に満たない。本文は終始
 * 案内役の話し方(皆様・ご案内する・ご覧ください・お楽しみください・
 * ご見学ください・お過ごしください)、「のだそうです」の口調も2か所。
 * Day1に昼食の一文なし、Day2(最終日)が12:00で終わっている。
 * アクアワールドの「日本一の飼育種類数を誇る」も言い切り。
 *
 * 直し方:
 * - Day1(水戸、到着日)に実在の行き先2か所を追加: 茨城県立歴史館(県立の
 *   博物館)・水戸芸術館(市立の文化施設、磯崎新設計のシンボルタワー)
 * - Day2(大洗、最終日)の滞在時間を実態に合わせて見直し(アクアワールドは
 *   580種68,000点の大規模水族館のため150分、大洗サンビーチは大洗海浜
 *   公園とあわせた海岸散策として135分)
 * - 口調をすべてサイト標準に修正、昼食の一文を両日に追加
 * - レンタカーの借り方(水戸駅前)・返し方(水戸駅前)を明記
 *
 * 座標(すべてOSM):
 * - 茨城県立歴史館: 36.3790051, 140.4504411(osm way 91530804)
 * - 水戸芸術館: 36.3804847, 140.4653089(osm way 95187732)
 * - 大洗マリンタワー: 36.3103845, 140.5707396(osm way 390555911。
 *   所有者は茨城県、指定管理者が大洗町という公共施設。
 *   pref.ibaraki.jp資料で確認)
 * - 大洗サンビーチ: 36.2960947, 140.5634614(osm node 7531176585)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KAIRAKUEN_MEMO =
  "JR水戸駅前でレンタカーを借りて、車でおよそ10分、偕楽園に着きます。天保13年(1842)、水戸藩9代藩主・徳川斉昭が造った、日本三名園の一つに数えられる大名庭園です。「偕楽園」という名前は、中国の古典『孟子』にある「古の人は民と偕に楽しむ」という一節にちなみ、領民と共に楽しむ場にしたいという斉昭の思いから名付けられたと伝えられています。厳しい自己研鑽と良質な休息、その両方が大切だという「一張一弛」の考えのもと、心休まる庭園として造られました。園内の別邸・好文亭も、建てる場所から意匠まで斉昭自らが定めたと伝えられています。梅の名所としても知られ、早春には園内を薫り高く彩ります。広大な庭園をじっくりと散策しましょう。この後は、車でおよそ10分、茨城県立歴史館へ向かいましょう。";

const REKISHIKAN_MEMO =
  "偕楽園から車でおよそ10分、茨城県立歴史館に着きます。茨城の歴史と文化を紹介する県立の博物館で、常設展示では旧石器時代から現代までの茨城の歩みを、考古資料や古文書、民具などとともにたどることができます。敷地内には、明治時代の学校建築を保存した旧水戸農業高等学校本館をはじめ、歴史的な建物も点在しています。この後は、車でおよそ10分、千波湖へ向かいましょう。";

const SENBAKO_MEMO =
  "茨城県立歴史館から車でおよそ10分、千波湖に着きます。偕楽園に隣接する湖で、湖畔にはおよそ3kmの遊歩道が整備され、散歩やジョギングを楽しむ人々の姿が見られます。千波公園周辺には食事処も多いので、ここで昼食にしましょう。水辺の景色を眺めながら、ゆっくりと歩いてみましょう。この後は、車でおよそ10分、水戸芸術館へ向かいましょう。";

const GEIJUTSUKAN_MEMO =
  "千波湖から車でおよそ10分、水戸芸術館に着きます。建築家・磯崎新の設計による複合文化施設で、コンサートホールや劇場、ギャラリーを備えています。高さ100mのらせん状のシンボルタワーが目を引き、正三角形のチタンパネルを組み合わせた四面体を積み重ねた、57面からなる独特の造形です。天に向かって伸びる形は、「伝統から創造へ」を象徴しているとされています。エレベーターで地上86.4mの展望室まで上ることもできます。この後は、車でおよそ10分、水戸城跡へ向かいましょう。";

const MITOJO_FROM = "水戸城跡（大手門）";
const MITOJO_MEMO =
  "水戸芸術館から車でおよそ10分、水戸城跡に着きます。御三家の一つである水戸徳川家の居城でしたが、江戸に近い立地から幕府への配慮もあってか、天守は築かれず、三階建ての櫓を天守の代わりとしていたと伝えられています。目の前にそびえる大手門は、佐竹氏が城主だった慶長年間(1596〜1615)ごろに建てられ、何度かの建て替えを経て明治時代に姿を消しましたが、令和2年(2020)、江戸時代後期の姿に忠実に復元されました。高さおよそ13メートル、幅およそ17メートルにおよぶ巨大な櫓門で、平成21年(2009)、県内のお寺で見つかった大手門ゆかりの扉が、復元のきっかけになったといわれています。復元された土塀とあわせて、水戸城下の歴史をたどりながら見学しましょう。この後は、車でおよそ8分、弘道館へ向かいましょう。";

const KODOKAN_MEMO =
  "水戸城跡から車でおよそ8分、弘道館に着きます。天保12年(1841)、水戸藩9代藩主・徳川斉昭が開いた藩校で、当時の藩校としては国内最大規模だったとされています。儒学や歴史、武芸はもちろん、医学や天文学まで学べる総合的な学びの場でした。厳しく学び鍛える弘道館(張)と、心身を休める偕楽園(弛)は、「一張一弛」の精神のもと、対をなす施設として造られています。今日訪れた偕楽園との関わりを思い浮かべながら、見学してみましょう。今夜は大洗の宿に泊まりましょう。";

const ISOSAKI_FROM = "大洗磯前神社";
const ISOSAKI_MEMO =
  "平安時代の斉衡3年(856)、この地で製塩をしていた人が、夜の海の上に光り輝くものを見つけ、翌朝には浜辺に不思議な形の石が現れたという言い伝えが残っています。その石は、かつてこの国を造り、常世の国へ去っていった神・大己貴命(おおなむちのみこと)と少彦名命(すくなひこなのみこと)が、人々を救うために再びこの地に戻ってきた姿だと伝えられ、これが神社の始まりとされています。太平洋の荒波に洗われる岩礁に立つ「神磯の鳥居」は、まさにこの二柱の祭神が降り立ったとされる場所で、朝日とともに浮かび上がるその姿は、多くの人を魅了してやみません。今も多くの人が参拝する神社です。境内や神磯の鳥居の前では、ほかの参拝者への敬意を持ってお参りしましょう。続いては、大洗の海の生き物に出会える水族館へ向かいましょう。";

const AQUA_FROM = "日本一の飼育種類数を誇る";
const AQUA_TO = "国内有数の飼育種類数とされる";
const AQUA_END_FROM = "大洗磯前神社で神々の伝説に触れたあとは、こちらで海そのものの豊かさをじっくりとお楽しみください。";
const AQUA_END_TO =
  "大洗磯前神社で神々の伝説に触れたあとは、こちらで海そのものの豊かさをじっくりと楽しみましょう。580種、68,000点もの生き物がいる大規模な水族館なので、じっくり見て回ると2時間ほどかかります。この後は、車でおよそ8分、大洗マリンタワーへ向かいましょう。";

const MARINTOWER_MEMO =
  "アクアワールド茨城県大洗水族館から車でおよそ8分、大洗マリンタワーに着きます。大洗港に立つ高さ60mの展望塔で、大洗町のシンボルとして親しまれています。展望室からは太平洋や大洗の町並みを一望でき、晴れた日には富士山や筑波山まで見えることもあります。タワー内の展望レストランで昼食をとることもできます。この後は、車でおよそ5分、大洗サンビーチへ向かいましょう。";

const SANBEACH_MEMO =
  "大洗マリンタワーから車でおよそ5分、大洗サンビーチに着きます。大洗海浜公園とあわせて、太平洋沿いにおよそ2kmにわたって砂浜と松林が続くエリアです。波の音を聞きながら、海岸沿いの遊歩道を歩いてみましょう。海水浴シーズン以外も、散策や日没の眺めを楽しむ人が訪れます。足元が滑りやすい岩場には近づきすぎないようにしましょう。大洗を満喫したら、車で水戸駅まで戻り(およそ35分)、レンタカーを返して、特急で帰りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c898c3d9%'`);
  const itinId = rows[0].id;

  const kairakuen = await findSpotInItinerary(itinId, { spotName: "偕楽園" });
  const mitojo = await findSpotInItinerary(itinId, { spotName: MITOJO_FROM });
  const isosaki = await findSpotInItinerary(itinId, { spotName: ISOSAKI_FROM });
  const aqua = await findSpotInItinerary(itinId, { spotName: "アクアワールド茨城県大洗水族館" });

  if (!aqua.memo?.includes(AQUA_FROM)) throw new Error("アクアワールドの文言が想定外です");
  if (!aqua.memo?.includes(AQUA_END_FROM)) throw new Error("アクアワールドの文言が想定外です(2)");

  console.log("確認OK。Day1 dayId:", kairakuen.dayId, " Day2 dayId:", isosaki.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({
      where: { id: itinId },
      data: {
        title: "偕楽園と水戸城下、大洗の海をめぐる1泊2日",
        description: "水戸城下の歴史散策と、大洗の神磯の鳥居・水族館・海岸の景色をあわせて楽しむ1泊2日です。",
      },
    });

    // Day1: 偕楽園(文修正)→茨城県立歴史館(新規)→千波湖(新規)→水戸芸術館(新規)→水戸城跡(文修正)→弘道館(新規)
    const items1: SpotOrderItem[] = [
      { id: kairakuen.id, data: { memo: KAIRAKUEN_MEMO, visitTime: t(9, 0), stayDurationMin: 70 } },
      {
        create: {
          name: "茨城県立歴史館",
          memo: REKISHIKAN_MEMO,
          lat: 36.3790051,
          lng: 140.4504411,
          visitTime: t(10, 20),
          stayDurationMin: 60,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10, transitLine: null }] },
        },
      },
      {
        create: {
          name: "千波湖",
          memo: SENBAKO_MEMO,
          lat: 36.3700002,
          lng: 140.4611091,
          visitTime: t(11, 30),
          stayDurationMin: 45,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10, transitLine: null }] },
        },
      },
      {
        create: {
          name: "水戸芸術館",
          memo: GEIJUTSUKAN_MEMO,
          lat: 36.3804847,
          lng: 140.4653089,
          visitTime: t(12, 25),
          stayDurationMin: 40,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10, transitLine: null }] },
        },
      },
      {
        id: mitojo.id,
        data: {
          memo: MITOJO_MEMO,
          visitTime: t(13, 15),
          stayDurationMin: 40,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10, transitLine: null }] },
        },
      },
      {
        create: {
          name: "弘道館",
          memo: KODOKAN_MEMO,
          lat: 36.3759247,
          lng: 140.4771604,
          visitTime: t(14, 3),
          stayDurationMin: 50,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8, transitLine: null }] },
        },
      },
    ];
    await setDaySpotOrder(kairakuen.dayId, items1, { tx });

    // Day2: 大洗磯前神社(文修正)→アクアワールド(文修正・150分)→大洗マリンタワー(新規)→大洗サンビーチ(新規)
    const items2: SpotOrderItem[] = [
      { id: isosaki.id, data: { memo: ISOSAKI_MEMO, visitTime: t(9, 30), stayDurationMin: 40 } },
      {
        id: aqua.id,
        data: {
          memo: aqua.memo!.replace(AQUA_FROM, AQUA_TO).replace(AQUA_END_FROM, AQUA_END_TO),
          visitTime: t(10, 20),
          stayDurationMin: 150,
        },
      },
      {
        create: {
          name: "大洗マリンタワー",
          memo: MARINTOWER_MEMO,
          lat: 36.3103845,
          lng: 140.5707396,
          visitTime: t(12, 58),
          stayDurationMin: 60,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8, transitLine: null }] },
        },
      },
      {
        create: {
          name: "大洗サンビーチ",
          memo: SANBEACH_MEMO,
          lat: 36.2960947,
          lng: 140.5634614,
          visitTime: t(14, 3),
          stayDurationMin: 135,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 5, transitLine: null }] },
        },
      },
    ];
    await setDaySpotOrder(isosaki.dayId, items2, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

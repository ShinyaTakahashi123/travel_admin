/**
 * #126 c898c3d9の直し(4回目)。企画運営・法務(2026-10-11)の指摘。
 *
 * 企画運営:
 * 1. Day1が14:53、Day2が16:18で、どちらも16:30〜17:00に届いていない。
 * 2. アクアワールド150分・大洗サンビーチ135分は決まりA違反(90分が目安)。
 *    延ばすのではなく実在の行き先を足す。
 * → Day1に常磐神社(徳川光圀・斉昭を祭神とする神社)・徳川ミュージアム
 *   (公益財団法人徳川ミュージアムの博物館)を追加(8か所、16:30-17:00に)。
 *   Day2にアクアワールド・大洗マリンタワー・大洗サンビーチを90分以内に
 *   短縮し、大洗わくわく科学館(日本原子力研究開発機構運営の公共施設)を
 *   追加(5か所、16:30-17:00に)。
 *
 * 法務(記録3ce7713):
 * ① 大洗磯前神社の神磯の鳥居(波打つ岩場)に安全の一文を追加。
 * ② 水戸城跡(大手門)の写真が実際は水戸一高の薬医門だったため削除。
 * ③ 座標5か所を修正(偕楽園・茨城県立歴史館・水戸城跡・大洗磯前神社・
 *    アクアワールド)。水戸城跡は大手門自体の点がOSMにないため、
 *    目の前の大手橋(w90583998)の点を推定として使用。
 * (参考: アクアワールドの「580種、68,000点」の重複表記も、90分化に
 *  伴う書き直しであわせて解消)
 *
 * 新しい座標:
 * - 偕楽園: 36.375135, 140.453545(OSM way 476016290。もとの値は
 *   偕楽園駅の点だった)
 * - 茨城県立歴史館: 36.379932, 140.451584(国土地理院「緑町二丁目
 *   1番15号」の点)
 * - 水戸城跡(大手門): 36.374940, 140.478493(大手橋 w90583998の中心、
 *   推定・大手橋の点)
 * - 大洗磯前神社: 36.315807, 140.587752(OSM way 416524886の中心)
 * - アクアワールド: 36.333318, 140.593871(OSM way 416524885の中心)
 * - 常磐神社: 36.3750011, 140.4559263(OSM way 90588651)
 * - 徳川ミュージアム: 36.3716845, 140.4458766(OSM way 350831457、
 *   公益財団法人徳川ミュージアム運営)
 * - 大洗わくわく科学館: 36.3075181, 140.5671245(OSM way 190695923、
 *   国立研究開発法人日本原子力研究開発機構運営)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TOKIWA_MEMO =
  "偕楽園から歩いておよそ5分、常磐神社に着きます。水戸藩2代藩主・徳川光圀と9代藩主・徳川斉昭を祭神とする神社で、明治6年(1873)に創建されました。境内の義烈館には、光圀が編さんを始めた『大日本史』の草稿や、斉昭が築かせた大砲「太極砲」などが展示されています。この後は、歩いておよそ12分、徳川ミュージアムへ向かいましょう。";

const TOKUGAWA_MUSEUM_MEMO =
  "常磐神社から歩いておよそ12分、徳川ミュージアムに着きます。水戸徳川家に伝わる大名道具や古文書類を保存・公開する博物館で、公益財団法人徳川ミュージアムが運営しています。水戸藩の歴史を物語る貴重な品々を間近に見ることができます。この後は、車でおよそ8分、茨城県立歴史館へ向かいましょう。";

const REKISHIKAN_OPENER_FROM = "偕楽園から車でおよそ10分、茨城県立歴史館に着きます。";
const REKISHIKAN_OPENER_TO = "徳川ミュージアムから車でおよそ8分、茨城県立歴史館に着きます。";
const REKISHIKAN_LUNCH_FROM = "この後は、車でおよそ10分、千波湖へ向かいましょう。";
const REKISHIKAN_LUNCH_TO = "周辺には食事処も多いので、ここで昼食にしましょう。この後は、車でおよそ10分、千波湖へ向かいましょう。";

const SENBAKO_LUNCH_FROM = "千波公園周辺には食事処も多いので、ここで昼食にしましょう。";
const SENBAKO_LUNCH_TO = "";

const MITOJO_OPENER_FROM = "水戸芸術館から車でおよそ10分、水戸城跡に着きます。";
const MITOJO_OPENER_TO = "水戸芸術館から車でおよそ10分、大手門前の大手橋に着きます。";

const ISOSAKI_SAFETY_FROM = "朝日とともに浮かび上がるその姿は、多くの人を魅了してやみません。";
const ISOSAKI_SAFETY_TO =
  "朝日とともに浮かび上がるその姿は、多くの人を魅了してやみません。波の打ち寄せる岩場には下りず、高い波に気をつけて眺めましょう。";

const AQUA_MEMO =
  "大洗磯前神社から車でおよそ10分、アクアワールド茨城県大洗水族館に着きます。平成14年(2002)にリニューアルオープンした、県内最大級とされる水族館で、大小60の水槽におよそ580種、68,000点もの海の生き物を展示しています。中でも自慢は、およそ60種類ものサメを飼育する、国内有数の飼育種類数とされるサメの展示です。繁殖にも力を入れており、シロワニやシマザメなど、日本で初めて繁殖に成功したとされる種も少なくありません。太平洋の荒波と大洗の海が育んだ豊かな生態系を、間近で観察できる水族館です。大洗磯前神社で神々の伝説に触れたあとは、こちらで海そのものの豊かさをじっくりと楽しみましょう。この後は、車でおよそ8分、大洗マリンタワーへ向かいましょう。";

const MARINTOWER_MEMO =
  "アクアワールド茨城県大洗水族館から車でおよそ8分、大洗マリンタワーに着きます。大洗港に立つ高さ60mの展望塔で、大洗町のシンボルとして親しまれています。展望室からは太平洋や大洗の町並みを一望でき、晴れた日には富士山や筑波山まで見えることもあります。タワー内の展望レストランで昼食をとることもできます。この後は、車でおよそ6分、大洗わくわく科学館へ向かいましょう。";

const WAKUWAKU_MEMO =
  "大洗マリンタワーから車でおよそ6分、大洗わくわく科学館に着きます。国立研究開発法人日本原子力研究開発機構が運営する科学館で、「海」をテーマに、原子力やエネルギーについて遊びながら学べる体験型の展示が並びます。実験や工作の催しが開かれることもあります。この後は、車でおよそ8分、大洗サンビーチへ向かいましょう。";

const SANBEACH_MEMO =
  "大洗わくわく科学館から車でおよそ8分、大洗サンビーチに着きます。大洗海浜公園とあわせて、太平洋沿いにおよそ2kmにわたって砂浜と松林が続くエリアです。波の音を聞きながら、海岸沿いの遊歩道を歩いてみましょう。海水浴シーズン以外も、散策や日没の眺めを楽しむ人が訪れます。足元が滑りやすい岩場には近づきすぎないようにしましょう。大洗を満喫したら、車で水戸駅まで戻り(およそ35分)、レンタカーを返して、特急で帰りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c898c3d9%'`);
  const itinId = rows[0].id;

  const kairakuen = await findSpotInItinerary(itinId, { spotName: "偕楽園" });
  const rekishikan = await findSpotInItinerary(itinId, { spotName: "茨城県立歴史館" });
  const senbako = await findSpotInItinerary(itinId, { spotName: "千波湖" });
  const mitojo = await findSpotInItinerary(itinId, { spotName: "水戸城跡（大手門）" });
  const isosaki = await findSpotInItinerary(itinId, { spotName: "大洗磯前神社" });
  const aqua = await findSpotInItinerary(itinId, { spotName: "アクアワールド茨城県大洗水族館" });
  const marintower = await findSpotInItinerary(itinId, { spotName: "大洗マリンタワー" });
  const sanbeach = await findSpotInItinerary(itinId, { spotName: "大洗サンビーチ" });

  if (!rekishikan.memo?.includes(REKISHIKAN_OPENER_FROM) || !rekishikan.memo?.includes(REKISHIKAN_LUNCH_FROM)) {
    throw new Error("茨城県立歴史館の文言が想定外です");
  }
  if (!senbako.memo?.includes(SENBAKO_LUNCH_FROM)) throw new Error("千波湖の文言が想定外です");
  if (!mitojo.memo?.includes(MITOJO_OPENER_FROM)) throw new Error("水戸城跡の文言が想定外です");
  if (!isosaki.memo?.includes(ISOSAKI_SAFETY_FROM)) throw new Error("大洗磯前神社の文言が想定外です");

  console.log("確認OK。Day1 dayId:", kairakuen.dayId, " Day2 dayId:", isosaki.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    // 水戸城跡の誤った写真(水戸一高の薬医門)を削除
    await tx.photo.deleteMany({ where: { spotId: mitojo.id } });

    const rekishikanMemo = rekishikan
      .memo!.replace(REKISHIKAN_OPENER_FROM, REKISHIKAN_OPENER_TO)
      .replace(REKISHIKAN_LUNCH_FROM, REKISHIKAN_LUNCH_TO);
    const senbakoMemo = senbako.memo!.replace(SENBAKO_LUNCH_FROM, SENBAKO_LUNCH_TO);
    const mitojoMemo = mitojo.memo!.replace(MITOJO_OPENER_FROM, MITOJO_OPENER_TO);
    const isosakiMemo = isosaki.memo!.replace(ISOSAKI_SAFETY_FROM, ISOSAKI_SAFETY_TO);

    // Day1: 偕楽園(座標修正)→常磐神社(新規)→徳川ミュージアム(新規)→
    //       茨城県立歴史館(文修正・座標修正・昼食)→千波湖(昼食の一文を外す)→
    //       水戸芸術館→水戸城跡(文・座標修正、写真削除)→弘道館
    const items1: SpotOrderItem[] = [
      { id: kairakuen.id, data: { lat: 36.375135, lng: 140.453545 } },
      {
        create: {
          name: "常磐神社",
          memo: TOKIWA_MEMO,
          lat: 36.3750011,
          lng: 140.4559263,
          visitTime: t(10, 15),
          stayDurationMin: 35,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
        },
      },
      {
        create: {
          name: "徳川ミュージアム",
          memo: TOKUGAWA_MUSEUM_MEMO,
          lat: 36.3716845,
          lng: 140.4458766,
          visitTime: t(11, 0),
          stayDurationMin: 50,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 12, transitLine: null }] },
        },
      },
      {
        id: rekishikan.id,
        data: {
          memo: rekishikanMemo,
          lat: 36.379932,
          lng: 140.451584,
          visitTime: t(12, 0),
          stayDurationMin: 55,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8, transitLine: null }] },
        },
      },
      {
        id: senbako.id,
        data: { memo: senbakoMemo, visitTime: t(13, 5), stayDurationMin: 45 },
      },
      { id: (await findSpotInItinerary(itinId, { spotName: "水戸芸術館" })).id, data: { visitTime: t(14, 0), stayDurationMin: 45 } },
      {
        id: mitojo.id,
        data: { memo: mitojoMemo, lat: 36.37494, lng: 140.478493, visitTime: t(14, 55), stayDurationMin: 40 },
      },
      { id: (await findSpotInItinerary(itinId, { spotName: "弘道館" })).id, data: { visitTime: t(15, 43), stayDurationMin: 55 } },
    ];
    await setDaySpotOrder(kairakuen.dayId, items1, { tx });

    // Day2: 大洗磯前神社(安全の一文・座標修正)→アクアワールド(90分・座標修正)→
    //       大洗マリンタワー(80分)→大洗わくわく科学館(新規)→大洗サンビーチ(90分)
    const items2: SpotOrderItem[] = [
      { id: isosaki.id, data: { memo: isosakiMemo, lat: 36.315807, lng: 140.587752 } },
      {
        id: aqua.id,
        data: { memo: AQUA_MEMO, lat: 36.333318, lng: 140.593871, visitTime: t(10, 20), stayDurationMin: 90 },
      },
      {
        id: marintower.id,
        data: { memo: MARINTOWER_MEMO, visitTime: t(11, 58), stayDurationMin: 80 },
      },
      {
        create: {
          name: "大洗わくわく科学館",
          memo: WAKUWAKU_MEMO,
          lat: 36.3075181,
          lng: 140.5671245,
          visitTime: t(13, 24),
          stayDurationMin: 90,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 6, transitLine: null }] },
        },
      },
      {
        id: sanbeach.id,
        data: {
          memo: SANBEACH_MEMO,
          visitTime: t(15, 2),
          stayDurationMin: 90,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8, transitLine: null }] },
        },
      },
    ];
    await setDaySpotOrder(isosaki.dayId, items2, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

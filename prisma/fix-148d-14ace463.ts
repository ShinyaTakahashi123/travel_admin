/**
 * #148 14ace463の直し(4回目)。企画運営・法務の指摘。
 *
 * 両方の一致した判断:
 * ①山口の水車・デンデラ野は、OSM生データ(両者で確認)にも名前のある点が
 *   なく、国土地理院も地割まで入れると大字の点に戻ってしまうため、決まりに
 *   合う座標が取れない。2か所とも外す(setDaySpotOrderのremoveで削除)。
 * ②続石の座標(国土地理院の地名点)は、法務の判断どおり使ってよい(座標の
 *   決まりの運用は企画運営が法務の判断を優先すると回答)。変更なし。
 *
 * 法務:
 * ③荒神神社の座標を、出どころ不明の値からOSMのn14081303347「荒神神社」
 *   39.3030742,141.5858270に修正。祈りの一文を決まりの形に、田んぼ・あぜ道
 *   に入らない一文を追加。
 *
 * 企画運営:
 * ④荒神神社の65分は小さな神社として長すぎるため28分に短縮。
 *
 * 2か所を外した分、空く時間(2時間強)をどう埋めるかは、企画運営に別途
 * 相談(候補: 鍧倉公園・遠野郷八幡宮を別の切り口で使う/宮守方面へ延ばす/
 * 既存3か所の滞在を見直す)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const GOJIN_FROM =
  "遠野ふるさと村から車でおよそ25分、荒神神社に着きます。茅葺き屋根の小さな社殿が、春は水を張った田んぼ、秋は黄金色の稲穂に囲まれる景色で知られ、遠野遺産の一つにも数えられています。権現様がまつられているので、静かに、敬意をもって参拝しましょう。この後は、車でおよそ15分、遠野の市街へ向かいましょう。";
const GOJIN_TO =
  "遠野ふるさと村から車でおよそ26分、荒神神社に着きます。茅葺き屋根の小さな社殿が、春は水を張った田んぼ、秋は黄金色の稲穂に囲まれる景色で知られ、遠野遺産の一つにも数えられています。権現様がまつられています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。田んぼやあぜ道には入らず、道から眺めましょう。この後は、車でおよそ15分、遠野の市街へ向かいましょう。";

const LUNCH_FROM = "荒神神社から車でおよそ15分、遠野の市街に着きます。中央通りの周辺には食堂やそば店が並んでいるので、ここで昼食をとりましょう。遠野は「遠野物語」の舞台として知られ、まちの中にも河童や座敷わらしにまつわる看板をいくつも見かけます。この後は、車でおよそ20分、山口の水車へ向かいましょう。";
const LUNCH_TO = "荒神神社から車でおよそ15分、遠野の市街に着きます。中央通りの周辺には食堂やそば店が並んでいるので、ここで昼食をとりましょう。遠野は「遠野物語」の舞台として知られ、まちの中にも河童や座敷わらしにまつわる看板をいくつも見かけます。この後は、車でおよそ15分、続石へ向かいましょう。";

const TSUZUKIISHI_FROM_OPENER = "デンデラ野から車でおよそ28分、続石の駐車場に着きます。";
const TSUZUKIISHI_TO_OPENER = "遠野の市街から車でおよそ15分、続石の駐車場に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '14ace463%'`);
  const itinId = rows[0].id;
  const furusato = await findSpotInItinerary(itinId, { spotName: "遠野ふるさと村" });
  const gojin = await findSpotInItinerary(itinId, { spotName: "荒神神社" });
  const lunch = await findSpotInItinerary(itinId, { spotName: "遠野の市街(昼食)" });
  const suisha = await findSpotInItinerary(itinId, { spotName: "山口の水車" });
  const dendera = await findSpotInItinerary(itinId, { spotName: "デンデラ野" });
  const tsuzuki = await findSpotInItinerary(itinId, { spotName: "続石" });
  const dayId = furusato.dayId;

  if (!gojin.memo?.includes(GOJIN_FROM)) throw new Error("荒神神社の文言が想定外です");
  if (lunch.memo !== LUNCH_FROM) throw new Error("遠野の市街(昼食)の文言が想定外です");
  if (!tsuzuki.memo?.includes(TSUZUKIISHI_FROM_OPENER)) throw new Error("続石の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    const day1: SpotOrderItem[] = [
      { id: furusato.id, data: {} },
      {
        id: gojin.id,
        data: {
          lat: 39.3030742,
          lng: 141.5858270,
          stayDurationMin: 28,
          memo: gojin.memo!.replace(GOJIN_FROM, GOJIN_TO),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 26 }] },
        },
      },
      {
        id: lunch.id,
        data: {
          visitTime: t(12, 4),
          memo: lunch.memo!.replace(LUNCH_FROM, LUNCH_TO),
        },
      },
      {
        id: tsuzuki.id,
        data: {
          visitTime: t(13, 9),
          memo: tsuzuki.memo!.replace(TSUZUKIISHI_FROM_OPENER, TSUZUKIISHI_TO_OPENER),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 15 }] },
        },
      },
    ];
    await setDaySpotOrder(dayId, day1, { tx, remove: [suisha.id, dendera.id] });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

/**
 * #119 949c4f43(ハウステンボスと九十九島)の直し(8回目)。10/1に途中で止めていた
 * 続き(企画運営 2026-10-10・2026-10-11の指示)。
 *
 * ①Day2を広げる(決まりA違反の修正後、14:09で終わっていた):
 *   森きらら→九十九島パールシーリゾート(昼食・施設のみに書き直し、70→40分)→
 *   【新規】九十九島遊覧船パールクィーン(桟橋から乗船、50分)→海きらら(文面を
 *   「旅の締めくくり」から次へ繋がる形に書き直し)→【新規】させぼ五番街(夕食・
 *   おみやげ、100分)。終了16:31。
 *   - 九十九島遊覧船パールクィーン・させぼ五番街の座標は、同じ事実を扱う既存の
 *     しおり bd3ec175(#213)で使われているOSM由来の座標を再利用(パールシー
 *     リゾートの桟橋=パールシーリゾート自身と同じ点、させぼ五番街=33.165116,
 *     129.723094)。文章はbd3ec175とは書き分けている
 * ②パレスハウステンボス・ドムトールンの座標(丸めた値だった)を直す:
 *   - パレスハウステンボス: OSM(api.openstreetmap.org/api/0.6/map、bbox
 *     129.783-129.792,33.083-33.090)に「パレス」「宮殿」「Palace」の名前が
 *     付いた建物・ノードが見つからなかった(ウェルカムゲート・パサージュ等は
 *     あるが宮殿そのものは無名)。国土地理院の住所検索(ハウステンボス町1-1)の
 *     点(33.080772, 129.784363)を、公園全体の代表地番として使用(建物そのもの
 *     とは少しずれる可能性があることを明記)
 *   - ドムトールン: 同bboxのOSMデータにある無名のman_made=tower(node
 *     2212580941、33.0848085, 129.7859694)を、塔の形状そのものの点として使用
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const PEARLSEA_MEMO =
  "森きららから車でおよそ4分、九十九島パールシーリゾートに着きます。九十九島観光の拠点となる施設で、展望デッキやレストラン、おみやげ店が入っています。大小の島々を望むデッキを眺めながら、ここで昼食にしましょう。食事を済ませたら、すぐそばの桟橋から出る遊覧船に乗り込みます。";

const PEARLQUEEN_MEMO =
  "パールシーリゾートの桟橋から、遊覧船パールクイーンに乗り込みます。九十九島は、大小208の島々が織りなす多島海で、この船は島々の間を縫うように、およそ50分かけて南のコースをめぐります。甲板に立つと、潮風とともに、間近に迫る島影を楽しめます。甲板に出るときは、手すりを持ち、足元に気をつけましょう。船の時刻や所要時間は、季節や当日の運航によって変わることがあるので、公式の案内で確かめましょう。";

const UMIKIRARA_MEMO =
  "九十九島遊覧船パールクィーンを降りて歩いてすぐ、海きらら(九十九島水族館)に着きます。九十九島の海に生きる生き物たちを紹介する水族館で、自然光が差し込む屋外の大水槽や、イルカのプールが見どころです。九十九島の多島海をイメージした展示を通して、海の生態系を身近に感じられます。この後は、車でおよそ20分、させぼ五番街へ向かいましょう。";

const GOBANGAI_MEMO =
  "海きららから車でおよそ20分、JR佐世保駅のみなと口そばのさせぼ五番街に着きます。海に面した商業施設で、佐世保の名物・レモンステーキや佐世保バーガーの店、おみやげ店が集まっています。長崎の旅の最後に、ここで夕食をとり、おみやげを探しましょう。レンタカーを返して、帰りの電車や飛行機に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '949c4f43%'`);
  const itinId = rows[0].id;

  const kirara = await findSpotInItinerary(itinId, { spotName: "森きらら" });
  const pearlsea = await findSpotInItinerary(itinId, { spotName: "九十九島パールシーリゾート" });
  const umikirara = await findSpotInItinerary(itinId, { spotName: "海きらら" });
  const kaicho = await findSpotInItinerary(itinId, { spotName: "展海峰" });
  const ishidake = await findSpotInItinerary(itinId, { spotName: "石岳展望台" });
  const palace = await findSpotInItinerary(itinId, { spotName: "パレスハウステンボス" });
  const dom = await findSpotInItinerary(itinId, { spotName: "ドムトールン" });

  if (!pearlsea.memo?.includes("遊覧船パールクイーンに乗り込み")) {
    throw new Error("九十九島パールシーリゾートの文言が想定外です(既に直っている可能性)");
  }

  console.log("確認OK。Day2 dayId:", pearlsea.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      pearlsea.dayId,
      [
        { id: kaicho.id, data: {} },
        { id: ishidake.id, data: {} },
        { id: kirara.id, data: {} },
        {
          id: pearlsea.id,
          data: { memo: PEARLSEA_MEMO, stayDurationMin: 40, visitTime: t(12, 7) },
        },
        {
          create: {
            name: "九十九島遊覧船パールクィーン",
            memo: PEARLQUEEN_MEMO,
            lat: pearlsea.lat,
            lng: pearlsea.lng,
            visitTime: t(12, 49),
            stayDurationMin: 50,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2, transitLine: null }] },
          },
        },
        {
          id: umikirara.id,
          data: { memo: UMIKIRARA_MEMO, visitTime: t(13, 41) },
        },
        {
          create: {
            name: "させぼ五番街",
            memo: GOBANGAI_MEMO,
            lat: 33.165116,
            lng: 129.723094,
            visitTime: t(14, 51),
            stayDurationMin: 100,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 20, transitLine: null }] },
          },
        },
      ],
      { tx }
    );

    await tx.spot.update({ where: { id: palace.id }, data: { lat: 33.080772, lng: 129.784363 } });
    await tx.spot.update({ where: { id: dom.id }, data: { lat: 33.0848085, lng: 129.7859694 } });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

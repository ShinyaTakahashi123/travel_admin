/**
 * #121 b2615800の直し(3回目)。企画運営(2026-10-11)・法務(2026-10-11、
 * 記録bfa3e2f)の指摘を反映。
 *
 * 法務①: 「スパ&ホテル舞浜ユーラシア」は宿泊施設の名前なのでスポットに
 * しない(業者名の決まり)。削除し、タイトルの「天然温泉」も外す。日帰りの
 * 入浴に寄る形にはせず、宿は名前を出さず「幕張や千葉の宿に泊まりましょう」
 * とする。浦安への移動がなくなった分、企画運営の指摘2(決まりA)と合わせて
 * 稲毛海浜公園(BOTANICA MUSEUM)・幕張メッセを新規に追加し、Day1を
 * 09:00〜16:35に組み直す。
 *
 * 企画運営:
 * 1. Day1開始 10:00→09:00
 * 2. イオンモール100分・三井アウトレット120分(決まりA)→90分に短縮
 * 3. 千葉ポートパークの文末「車でおよそ10分」→「歩いておよそ5分」
 * 4. Day2終了 16:25→16:35(加曽利貝塚博物館95→105分)
 * 5. 幕張海浜公園の途切れた文を直す
 * 6. 千葉公園の出典: https://ja.wikipedia.org/wiki/千葉公園
 *
 * 法務②: 幕張海浜公園の浜は遊泳禁止のため、海に入らない・波打ち際の
 * 注意の一文を追加
 * 法務③: イオンモールの写真が2013年の建設中の写真(Wikimedia Commonsの
 * sourceUrlに"under_construction"と明記)だったため削除
 * 法務④座標:
 * - 幕張海浜公園: 35.6431850, 140.0419320(OSM node、バス停・レンタル
 *   ステーションの実在点。公園自体に単独のwayがないため、園内の実在点を使用)
 * - イオンモール幕張新都心: 35.654683, 140.030455(法務指摘のway 695894961の中心)
 * - 千葉ポートタワー: 35.600422, 140.097859(法務指摘のway 604291866の中心)
 *
 * 新規2か所の座標(Nominatim):
 * - 稲毛海浜公園: 35.6213659, 140.0594772(osm_id 219233541)。BOTANICA
 *   MUSEUMは令和7年(2025)3月29日に「千葉市花の美術館」からリニューアル
 *   (ja.wikipedia.org/wiki/千葉市花の美術館で確認、現在営業中)
 * - 幕張メッセ: 35.6470701, 140.0343241(osm_id 374815914、exhibition_centre)
 *   事実はja.wikipedia.org/wiki/幕張メッセ(1989年開館、槇文彦設計)
 *
 * 千葉県立美術館の開館年(1974年)は公式サイト(chiba-muse.or.jp/ART/、
 * 2024年に開館50周年と記載)でも確認済み。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const INAGE_MEMO =
  "JR稲毛海岸駅前でレンタカーを借りて、今日はまず稲毛海浜公園から始まります。人工海浜「いなげの浜」に面した公園で、園内には温室やバラ園のあるBOTANICA MUSEUM(令和7年(2025)に「千葉市花の美術館」からリニューアル)もあります。熱帯・亜熱帯の植物や洋ランの温室、バラ園を見学しましょう。この後は、車でおよそ9分、幕張海浜公園へ向かいましょう。";

const KAIHIN_KOEN_MEMO =
  "稲毛海浜公園から車でおよそ9分、幕張海浜公園に着きます。幕張の浜に面した、海を埋め立ててつくられた幕張新都心の海辺の公園です。千葉市の海辺には、幕張の浜・検見川の浜・いなげの浜という3つの人工海浜が続き、あわせて総延長およそ4.3キロと、人工海浜としては日本一の長さといわれています。ウインドサーフィンなどのマリンスポーツを楽しむ人々の姿も見られます。この浜は遊泳禁止なので、海には入らず、波打ち際には近づきすぎないようにしましょう。潮風を感じながら、ゆったりと散策しましょう。この後は、車でおよそ8分、イオンモール幕張新都心へ向かいましょう。";

const MAKUHARI_MESSE_MEMO =
  "三井アウトレットパーク幕張から車でおよそ3分、幕張メッセに着きます。平成元年(1989)に開館した、国内では東京ビッグサイトに次ぐ規模を誇る展示施設です。建築家・槇文彦が設計した、全長516メートルにおよぶ柱のない空間が特徴で、国内外の見本市やコンサートなど、さまざまな催しが開かれています。催しのない日でも、外観の迫力ある建築を眺められます。今夜は、幕張や千葉の宿に泊まりましょう。";

const PORT_PARK_FROM = "千葉ポートタワーから歩いてすぐ、千葉ポートパークに着きます。千葉港に面した広い公園で、芝生の広場や、水と緑にふれあえる施設が整っています。タワーを背景に、海辺をのんびり歩きましょう。この後は、車でおよそ10分、千葉県立美術館へ向かいましょう。";
const PORT_PARK_TO =
  "千葉ポートタワーから歩いてすぐ、千葉ポートパークに着きます。千葉港に面した広い公園で、芝生の広場や、水と緑にふれあえる施設が整っています。タワーを背景に、海辺をのんびり歩きましょう。この後は、歩いておよそ5分、千葉県立美術館へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'b2615800%'`);
  const itinId = rows[0].id;

  const kaihinKoen = await findSpotInItinerary(itinId, { spotName: "幕張海浜公園" });
  const aeon = await findSpotInItinerary(itinId, { spotName: "イオンモール幕張新都心" });
  const outlet = await findSpotInItinerary(itinId, { spotName: "三井アウトレットパーク幕張" });
  const eurasia = await findSpotInItinerary(itinId, { spotName: "スパ&ホテル舞浜ユーラシア" });
  const portPark = await findSpotInItinerary(itinId, { spotName: "千葉ポートパーク" });
  const portTower = await findSpotInItinerary(itinId, { spotName: "千葉ポートタワー" });
  const kasori = await findSpotInItinerary(itinId, { spotName: "加曽利貝塚博物館" });

  if (!portPark.memo?.includes(PORT_PARK_FROM)) throw new Error("千葉ポートパークの文言が想定外です");

  console.log("確認OK。day1:", kaihinKoen.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({
      where: { id: itinId },
      data: {
        title: "幕張・稲毛の海辺と千葉みなとを巡る、のんびり千葉1泊2日の旅",
        description:
          "海を埋め立ててつくられた幕張・稲毛の海浜公園でのんびり過ごし、2日目は千葉みなとの美術館・神社・公園・貝塚を巡る。日常から少し離れて過ごす、癒し重視のプランです。",
      },
    });

    await tx.photo.delete({ where: { id: (await tx.photo.findFirstOrThrow({ where: { spotId: aeon.id } })).id } });

    await setDaySpotOrder(
      kaihinKoen.dayId,
      [
        {
          create: {
            name: "稲毛海浜公園",
            memo: INAGE_MEMO,
            lat: 35.6213659,
            lng: 140.0594772,
            visitTime: t(9, 0),
            stayDurationMin: 80,
          },
        },
        {
          id: kaihinKoen.id,
          data: {
            memo: KAIHIN_KOEN_MEMO,
            visitTime: t(10, 29),
            lat: 35.6431850,
            lng: 140.0419320,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 9, transitLine: null }] },
          },
        },
        { id: aeon.id, data: { visitTime: t(12, 7), stayDurationMin: 90, lat: 35.654683, lng: 140.030455 } },
        { id: outlet.id, data: { visitTime: t(13, 47), stayDurationMin: 90 } },
        {
          create: {
            name: "幕張メッセ",
            memo: MAKUHARI_MESSE_MEMO,
            lat: 35.6470701,
            lng: 140.0343241,
            visitTime: t(15, 20),
            stayDurationMin: 75,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 3, transitLine: null }] },
          },
        },
      ],
      { remove: [eurasia.id], tx }
    );
  }, { timeout: 60000 });

  await updateSpotInItinerary(itinId, { spotId: portPark.id }, { memo: PORT_PARK_TO });
  await updateSpotInItinerary(itinId, { spotId: portTower.id }, { lat: 35.600422, lng: 140.097859 });
  await updateSpotInItinerary(itinId, { spotId: kasori.id }, { stayDurationMin: 105 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

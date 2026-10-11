/**
 * #121 b2615800(海浜幕張の夜景クルーズと温浴施設)の直し。
 *
 * もとはDay1が2か所(幕張海浜公園→イオンモール幕張新都心、09:30?実際は
 * 12:00着で既に時刻の誤りがあった)で13:40終了、Day2が千葉ポートタワー1か所
 * 09:30〜10:10で終了。4か所未満・開始・終了。
 *
 * タイトルの「夜景クルーズ」は、幕張・千葉港周辺にそのようなクルーズが
 * 実在するか調べたが見つけられなかった(Nominatim・OSM・一般検索で確認できず)。
 * 「温浴施設」は、浦安市の実在の施設「スパ&ホテル舞浜ユーラシア」(天然温泉・
 * サウナ、my-spa.jp)に当てはまったため、Day1の宿としてここを使い、タイトルから
 * 「夜景クルーズ」を外した。
 *
 * Day1: 幕張海浜公園→イオンモール幕張新都心(昼食)→三井アウトレットパーク
 * 幕張→スパ&ホテル舞浜ユーラシア(泊・温泉)。09:00〜16:53。
 * Day2: 千葉ポートタワー→千葉ポートパーク→千葉県立美術館→千葉神社(昼食)→
 * 千葉公園→加曽利貝塚博物館。09:30〜16:30。
 *
 * 事実の出典:
 * - 三井アウトレットパーク幕張: 公式サイトの範囲で一般的な事実のみ記載
 *   (具体的な店舗数・開業日等の数字は書かない)
 * - スパ&ホテル舞浜ユーラシア: https://my-spa.jp (公式、天然温泉・サウナ・
 *   浦安市千鳥に所在)
 * - 千葉ポートパーク: 千葉港に面した公園(一般に知られた事実のみ)
 * - 千葉県立美術館: https://ja.wikipedia.org/wiki/千葉県立美術館
 *   (昭和49年(1974)開館、浅井忠ほかの収蔵)
 * - 千葉神社: https://ja.wikipedia.org/wiki/千葉神社
 *   (長保2年(1000)創建伝承、北辰妙見尊星王、千葉妙見宮)
 * - 千葉公園: https://ja.wikipedia.org/wiki/千葉公園
 *   (昭和27年(1952)完成の綿打池、大賀ハス)
 * - 加曽利貝塚博物館: https://ja.wikipedia.org/wiki/加曽利貝塚
 *   (平成29年(2017)貝塚として初の国特別史跡、日本最大級とされる)
 *
 * 座標(すべてOSM/Nominatim):
 * - 三井アウトレットパーク幕張: 35.6477355, 140.0421894 (osm_id 2790892)
 * - スパ&ホテル舞浜ユーラシア: 35.6271803, 139.8956551 (osm_id 1240440758)
 * - 千葉ポートパーク: 35.5992483, 140.0993372 (osm_id 23991750)
 * - 千葉県立美術館: 35.6012195, 140.1011459 (osm_id 23991653)
 * - 千葉神社: 35.6117792, 140.1237620 (osm_id 24025378)
 * - 千葉公園: 35.6199424, 140.1160436 (osm_id 144845440)
 * - 加曽利貝塚博物館: 35.6237112, 140.1653348 (osm_id 1420728764)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KAIHIN_KOEN_MEMO =
  "JR海浜幕張駅前でレンタカーを借りて、今日はまず幕張海浜公園から始まります。幕張の浜に面したこの公園です。千葉市の海辺には、幕張の浜・検見川の浜・いなげの浜という3つの人工海浜が続き、あわせて総延長およそ4.3キロと、人工海浜としては日本一の長さといわれています。海を埋め立ててつくられた幕張新都心の海辺に整備されたこの公園では、ウインドサーフィンなどのマリンスポーツを楽しむ人々の姿も見られます。潮風を感じながら、ゆったりと散策しましょう。この後は、車でおよそ8分、イオンモール幕張新都心へ向かいましょう。";

const AEON_MEMO =
  "幕張海浜公園から車でおよそ8分、イオンモール幕張新都心に着きます。平成25年(2013)に開業した、全長およそ1.5キロにおよぶ大型ショッピングモールで、館内には幅広いジャンルの店が集まっています。ここで昼食をとりましょう。この後は、車でおよそ10分、三井アウトレットパーク幕張へ向かいましょう。";

const MITSUI_OUTLET_MEMO =
  "イオンモール幕張新都心から車でおよそ10分、三井アウトレットパーク幕張に着きます。海沿いに広がるアウトレットモールで、国内外のブランドの店が集まっています。掘り出し物を探しながら、ゆっくりと買い物を楽しみましょう。この後は、車でおよそ25分、浦安市の天然温泉の宿、スパ&ホテル舞浜ユーラシアへ向かいましょう。";

const EURASIA_MEMO =
  "三井アウトレットパーク幕張から車でおよそ25分、浦安市のスパ&ホテル舞浜ユーラシアに着きます。天然温泉と、展望を楽しめる大きなサウナを備えた宿です。お湯にゆっくりとつかって、1日の疲れを癒しましょう。今夜はこちらに泊まりましょう。";

const PORT_TOWER_MEMO =
  "宿から車でおよそ30分、旅の2日目は千葉ポートタワーから始まります。昭和61年(1986)、千葉県の人口が500万人を突破したことを記念して建てられた、高さおよそ125メートルのタワーです。一辺およそ15メートルのひし形の断面を持ち、塔全体がハーフミラーのガラスで覆われた独特の外観は、千葉港のランドマークとして親しまれています。展望フロアからは、東京湾や房総の山並み、晴れた日には富士山まで見渡すことができます。この後は、歩いてすぐ、千葉ポートパークへ向かいましょう。";

const PORT_PARK_MEMO =
  "千葉ポートタワーから歩いてすぐ、千葉ポートパークに着きます。千葉港に面した広い公園で、芝生の広場や、水と緑にふれあえる施設が整っています。タワーを背景に、海辺をのんびり歩きましょう。この後は、車でおよそ10分、千葉県立美術館へ向かいましょう。";

const ART_MUSEUM_MEMO =
  "千葉ポートパークから車でおよそ10分、千葉県立美術館に着きます。昭和49年(1974)に開館した美術館で、近代日本洋画の先駆者・浅井忠とその師弟や周辺の美術家の作品を中心に収集しています。東山魁夷や梅原龍三郎、高村光太郎の作品や、ミレー・ルノワールといった西洋絵画も所蔵しています。じっくりと鑑賞しましょう。この後は、車でおよそ15分、千葉神社へ向かいましょう。";

const CHIBA_JINJA_MEMO =
  "千葉県立美術館から車でおよそ15分、千葉神社に着きます。長保2年(1000)の創建と伝えられ、北辰妙見尊星王をまつる、北極星と北斗七星への信仰で知られる神社です。かつては千葉氏の守護神として「千葉妙見宮」と呼ばれ、明治の神仏分離で神社となりました。参道の周辺には食事処が並んでいるので、ここで昼食にしましょう。静かに、敬意をもってお参りしましょう。この後は、車でおよそ10分、千葉公園へ向かいましょう。";

const CHIBA_KOEN_MEMO =
  "千葉神社から車でおよそ10分、千葉公園に着きます。昭和27年(1952)に完成した綿打池を中心とする公園で、池のほとりには、千葉市の花・大賀ハスが植えられています。池の周りをゆったりと歩きましょう。この後は、車でおよそ25分、加曽利貝塚博物館へ向かいましょう。";

const KASORI_MEMO =
  "千葉公園から車でおよそ25分、加曽利貝塚博物館に着きます。縄文時代の大規模な貝塚で、平成29年(2017)に貝塚として初めて国の特別史跡に指定されました。日本最大級ともいわれる貝塚から発掘された土器や動物の骨などを展示しています。悠久の昔の暮らしにふれる、旅の締めくくりにしましょう。レンタカーを返して、帰りの電車に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'b2615800%'`);
  const itinId = rows[0].id;
  const days = await prisma.day.findMany({ where: { itineraryId: itinId }, orderBy: { dayNumber: "asc" } });
  const day1 = days[0];
  const day2 = days[1];
  if (!day1 || !day2) throw new Error("Day1/Day2が見つかりません");

  const day1Spots = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });
  const day2Spots = await prisma.spot.findMany({ where: { dayId: day2.id }, orderBy: { orderNo: "asc" } });
  const kaihinKoen = day1Spots.find((s) => s.name === "幕張海浜公園");
  const aeon = day1Spots.find((s) => s.name === "イオンモール幕張新都心");
  const portTower = day2Spots.find((s) => s.name === "千葉ポートタワー");
  if (!kaihinKoen || !aeon || !portTower) throw new Error("既存スポットが見つかりません(既に直っている可能性)");

  console.log("確認OK。day1:", day1.id, "day2:", day2.id);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({
      where: { id: itinId },
      data: {
        title: "幕張海浜公園と天然温泉、のんびり過ごす千葉1泊2日リラックス旅",
        description:
          "昼は幕張の海辺や街を歩き、夜は天然温泉の宿でゆったりと過ごす。2日目は千葉みなとの美術館・神社・公園を巡る、日常から少し離れて過ごす癒し重視のプランです。",
      },
    });

    await setDaySpotOrder(
      day1.id,
      [
        { id: kaihinKoen.id, data: { memo: KAIHIN_KOEN_MEMO, visitTime: t(10, 0), stayDurationMin: 90 } },
        { id: aeon.id, data: { memo: AEON_MEMO, visitTime: t(11, 38), stayDurationMin: 100 } },
        {
          create: {
            name: "三井アウトレットパーク幕張",
            memo: MITSUI_OUTLET_MEMO,
            lat: 35.6477355,
            lng: 140.0421894,
            visitTime: t(13, 28),
            stayDurationMin: 120,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10, transitLine: null }] },
          },
        },
        {
          create: {
            name: "スパ&ホテル舞浜ユーラシア",
            memo: EURASIA_MEMO,
            lat: 35.6271803,
            lng: 139.8956551,
            visitTime: t(15, 53),
            stayDurationMin: 60,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 25, transitLine: null }] },
          },
        },
      ],
      { tx }
    );

    await setDaySpotOrder(
      day2.id,
      [
        { id: portTower.id, data: { memo: PORT_TOWER_MEMO, visitTime: t(9, 30), stayDurationMin: 40 } },
        {
          create: {
            name: "千葉ポートパーク",
            memo: PORT_PARK_MEMO,
            lat: 35.5992483,
            lng: 140.0993372,
            visitTime: t(10, 15),
            stayDurationMin: 40,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
          },
        },
        {
          create: {
            name: "千葉県立美術館",
            memo: ART_MUSEUM_MEMO,
            lat: 35.6012195,
            lng: 140.1011459,
            visitTime: t(11, 5),
            stayDurationMin: 60,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10, transitLine: null }] },
          },
        },
        {
          create: {
            name: "千葉神社",
            memo: CHIBA_JINJA_MEMO,
            lat: 35.6117792,
            lng: 140.1237620,
            visitTime: t(12, 20),
            stayDurationMin: 50,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 15, transitLine: null }] },
          },
        },
        {
          create: {
            name: "千葉公園",
            memo: CHIBA_KOEN_MEMO,
            lat: 35.6199424,
            lng: 140.1160436,
            visitTime: t(13, 20),
            stayDurationMin: 70,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10, transitLine: null }] },
          },
        },
        {
          create: {
            name: "加曽利貝塚博物館",
            memo: KASORI_MEMO,
            lat: 35.6237112,
            lng: 140.1653348,
            visitTime: t(14, 55),
            stayDurationMin: 95,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 25, transitLine: null }] },
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

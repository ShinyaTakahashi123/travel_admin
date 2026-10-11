/**
 * #125 c4f58fdd(乳頭温泉郷、秘湯の湯めぐりを楽しむ田沢湖1泊2日)の全面見直し。
 * 企画運営・法務(2026-10-11)の指摘。
 *
 * もとはDay1が「鶴の湯温泉」(私営の宿の名前)1か所のみ、Day2が「乳頭温泉郷」
 * (本文で7つの宿の名前をすべて列挙)1か所のみという、業者名ルールに
 * 構造から反する内容だった。タイトル・説明文も鶴の湯温泉の名前を中心に
 * 書かれていたため、書き直す。
 *
 * 直し方(企画運営・法務の案どおり):
 * - 「乳頭温泉郷」は地域そのものの1スポットとし、宿の名前は出さず
 *   「山あいに一軒宿が点在する温泉地」のように紹介する(日帰り入浴の
 *   一文つき)。Day1(到着・昼食・最初の入浴)とDay2(朝のブナ林散策・
 *   もう一つの入浴)の2回に分けて訪れる(同じ場所だが活動が違う)。
 * - ほかは店・宿でない公共の行き先で組む: たつこ像・御座石神社・
 *   姫観音像(田沢湖)、抱返り渓谷、角館樺細工伝承館・新潮社記念文学館・
 *   角館武家屋敷通り(角館)。
 * - 口調(皆様・ご案内する・お楽しみください・のだそうです)をサイト標準に。
 *
 * 座標(すべてOSM、Nominatim/Overpass):
 * - たつこ像: 39.7140727, 140.6342886(osm node 7236257563)
 * - 御座石神社: 39.7516093, 140.6504812(osm way 837055330)
 * - 姫観音像: 39.7480499, 140.6763238(osm node 10089738062)
 * - 乳頭温泉郷: 39.7469, 140.8322(既存の値をそのまま使用)
 * - 抱返り渓谷(回顧の滝): 39.6091849, 140.6701511(osm node 754841290)
 * - 角館樺細工伝承館: 39.5995317, 140.5611586(osm relation 14721803)
 * - 新潮社記念文学館: 39.5928911, 140.5655624(osm way 253970106)
 * - 角館武家屋敷通り: 39.5978313, 140.5621565(osm node 5670412921)
 *
 * 事実の出典:
 * - 姫観音像: 1940年(昭和15)建立、玉川の強酸性水の導入で死んだ魚と
 *   辰子姫の慰霊のため(rurubu.jp/andmore/article/19529)
 * - 新潮社記念文学館: 角館出身の新潮社創業者・佐藤義亮を記念し2000年開館、
 *   仙北市公式サイト(city.semboku.akita.jp)で確認
 * - 田沢湖は水深423.4mで日本一深い湖(複数の観光サイトで確認)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TATSUKO_MEMO =
  "田沢湖の南西岸、潮瀬崎に着きます。田沢湖は水深423.4mと日本一深い湖で、冬も凍らないほど澄んだ青さから「辰子ブルー」とも呼ばれます。湖畔に立つ黄金色のたつこ像は、永遠の美しさを願って龍に姿を変えたという辰子姫の伝説にちなむ像です。湖を見渡しながら、しばらく散策しましょう。この後は、車でおよそ10分、御座石神社へ向かいましょう。";

const GOZAISHI_MEMO =
  "たつこ像から車でおよそ10分、御座石神社に着きます。田沢湖の北岸にあり、辰子姫を祭神とする神社です。湖に向かって立つ赤い鳥居が印象的で、湖の水位によっては鳥居が湖面に浮かんで見えることもあります。境内には、辰子姫の伝説にちなむ岩や木もあります。この後は、車でおよそ8分、姫観音像へ向かいましょう。";

const HIMEKANNON_MEMO =
  "御座石神社から車でおよそ8分、姫観音像に着きます。昭和15年(1940)、発電やかんがいのため玉川の強い酸性の水を田沢湖に引き入れたことで死んでしまった多くの魚と、辰子姫を慰めるために建てられた観音像です。湖に向かって静かに立つ像を見ながら、少し足を止めましょう。この後は、車でおよそ30分、山あいの乳頭温泉郷へ向かいましょう。";

const NYUTO_DAY1_MEMO =
  "姫観音像から車でおよそ30分、乳頭山の山麓に広がる乳頭温泉郷に着きます。ブナの原生林に囲まれた一帯に、日帰り入浴のできる一軒宿が点在する、東北でも指折りの温泉地です。宿ごとに泉質や湯の色が異なり、白く濁った乳白色の湯や、無色透明の湯など、湯めぐりが楽しめます。まずは腰を落ち着けて昼食をとり、日帰り入浴のできる宿でひと風呂浴びましょう。今夜はこの近くの宿に泊まりましょう。";

const NYUTO_DAY2_MEMO =
  "乳頭温泉郷で迎える朝です。ブナの原生林の中には、宿から宿へと歩いて通える遊歩道が整備されています。朝の澄んだ空気の中、木々の間を歩きながら、昨日とはまた違う宿の湯に浸かってみましょう。山あいならではの静かな時間を過ごしたら、ここから南へ、抱返り渓谷へ向かいます。";

const KAERIMIZU_MEMO =
  "乳頭温泉郷から車でおよそ45分、抱返り渓谷に着きます。玉川沿いに広がる渓谷で、新緑や紅葉の時期には特に美しい景色が広がることから、「東北の耶馬渓」とも呼ばれます。遊歩道の途中にかかる神の岩橋を渡った先には、抱返り渓谷のシンボルとされる回顧の滝があります。岩場や吊り橋は足元が滑りやすいので、気をつけて歩きましょう。この後は、車でおよそ18分、角館の町なかへ向かいましょう。";

const KABAZAIKU_MEMO =
  "抱返り渓谷から車でおよそ18分、角館の町なかにある角館樺細工伝承館に着きます。角館の市街には食事処も多いので、ここで昼食をとってから見学するのもよいでしょう。樺細工は、山桜の樹皮を使った角館伝統の工芸品で、館内では製作の様子を間近に見学できるほか、歴史を紹介する展示もあります。この後は、歩いておよそ10分、新潮社記念文学館へ向かいましょう。";

const SHINCHOSHA_MEMO =
  "角館樺細工伝承館から歩いておよそ10分、新潮社記念文学館に着きます。角館出身で、出版社・新潮社を創業した佐藤義亮の功績を伝える文学館です。2000年に開館し、近代文学に関する貴重な資料や、秋田県ゆかりの文学者を紹介する展示を見学できます。この後は、歩いておよそ8分、角館武家屋敷通りへ向かいましょう。";

const BUKEYASHIKI_MEMO =
  "新潮社記念文学館から歩いておよそ8分、角館武家屋敷通りに着きます。江戸時代の面影を残す町並みで、黒い板塀と枝垂桜が続く通り沿いには、今も武家屋敷が保存され、「みちのくの小京都」とも呼ばれています。いくつかの屋敷は内部も見学でき、当時の暮らしぶりを伝える道具や資料が展示されています。通りをゆっくりと歩きながら、時代をさかのぼるような町並みを楽しみましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c4f58fdd%'`);
  const itinId = rows[0].id;

  const tsuru = await findSpotInItinerary(itinId, { dayNumber: 1, spotName: "鶴の湯温泉" });
  const nyutoDay2 = await findSpotInItinerary(itinId, { dayNumber: 2, spotName: "乳頭温泉郷" });

  console.log("確認OK。Day1 dayId:", tsuru.dayId, " Day2 dayId:", nyutoDay2.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({
      where: { id: itinId },
      data: {
        title: "田沢湖の伝説と乳頭温泉郷の湯めぐりを楽しむ1泊2日",
        description:
          "辰子姫の伝説が残る田沢湖から、ブナ林に囲まれた乳頭温泉郷へ。角館の武家屋敷通りもあわせて巡る、秋田の自然と町並みを楽しむ1泊2日です。",
      },
    });

    // Day1: 鶴の湯温泉(削除)→たつこ像・御座石神社・姫観音像・乳頭温泉郷(到着・昼食・入浴)
    const items1: SpotOrderItem[] = [
      {
        create: {
          name: "たつこ像",
          memo: TATSUKO_MEMO,
          lat: 39.7140727,
          lng: 140.6342886,
          visitTime: t(9, 0),
          stayDurationMin: 20,
        },
      },
      {
        create: {
          name: "御座石神社",
          memo: GOZAISHI_MEMO,
          lat: 39.7516093,
          lng: 140.6504812,
          visitTime: t(9, 30),
          stayDurationMin: 35,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10, transitLine: null }] },
        },
      },
      {
        create: {
          name: "姫観音像",
          memo: HIMEKANNON_MEMO,
          lat: 39.7480499,
          lng: 140.6763238,
          visitTime: t(10, 13),
          stayDurationMin: 20,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8, transitLine: null }] },
        },
      },
      {
        create: {
          name: "乳頭温泉郷",
          memo: NYUTO_DAY1_MEMO,
          lat: 39.7469,
          lng: 140.8322,
          visitTime: t(11, 3),
          stayDurationMin: 90,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 30, transitLine: null }] },
        },
      },
    ];
    await setDaySpotOrder(tsuru.dayId, items1, { remove: [tsuru.id], tx });

    // Day2: 乳頭温泉郷(朝、継続・書き直し)→抱返り渓谷→樺細工伝承館→新潮社記念文学館→武家屋敷通り
    const items2: SpotOrderItem[] = [
      {
        id: nyutoDay2.id,
        data: {
          memo: NYUTO_DAY2_MEMO,
          lat: 39.7469,
          lng: 140.8322,
          visitTime: t(9, 0),
          stayDurationMin: 90,
          transitLegs: { deleteMany: {} },
        },
      },
      {
        create: {
          name: "抱返り渓谷",
          memo: KAERIMIZU_MEMO,
          lat: 39.6091849,
          lng: 140.6701511,
          visitTime: t(11, 15),
          stayDurationMin: 60,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 45, transitLine: null }] },
        },
      },
      {
        create: {
          name: "角館樺細工伝承館",
          memo: KABAZAIKU_MEMO,
          lat: 39.5995317,
          lng: 140.5611586,
          visitTime: t(12, 33),
          stayDurationMin: 45,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 18, transitLine: null }] },
        },
      },
      {
        create: {
          name: "新潮社記念文学館",
          memo: SHINCHOSHA_MEMO,
          lat: 39.5928911,
          lng: 140.5655624,
          visitTime: t(13, 28),
          stayDurationMin: 60,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10, transitLine: null }] },
        },
      },
      {
        create: {
          name: "角館武家屋敷通り",
          memo: BUKEYASHIKI_MEMO,
          lat: 39.5978313,
          lng: 140.5621565,
          visitTime: t(14, 36),
          stayDurationMin: 114,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8, transitLine: null }] },
        },
      },
    ];
    await setDaySpotOrder(nyutoDay2.dayId, items2, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

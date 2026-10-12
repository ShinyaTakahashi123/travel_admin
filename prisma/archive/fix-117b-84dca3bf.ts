/**
 * #117 84dca3bfの直し(2回目)。企画運営(15:52)と法務(15:53)の指摘に対応。
 *
 * 企画運営:
 * 1. 河童橋の115分を40分に短縮し、空いた時間で上高地ビジターセンター・
 *    小梨平キャンプ場・上高地インフォメーションセンターを追加(岳沢
 *    湿原はOSM/Nominatimで座標の裏付けが取れなかったため見送った)
 * 2. 大正池の書き出しに、松本駅・高山からの沢渡・平湯までの行き方を
 *    一言追加
 * 3. 「お出かけ前に最新情報をご確認ください」を「確かめましょう」に
 *
 * 法務:
 * ①大正池〜明神の歩く区間(2時間以上)にクマへの注意の一文を追加
 * ②河童橋の座標をOSMの点(way 150718102の中心)に修正
 *
 * 新しい並び: 大正池→田代池→ウェストン碑→明神池・穂高神社奥宮(昼食)
 * →河童橋→上高地ビジターセンター→小梨平キャンプ場→上高地
 * インフォメーションセンター、09:00〜16:56。
 *
 * 事実確認: 上高地ビジターセンター(小梨平入口、自然に関する展示・
 * 映像上映、「山に向かう心」をテーマにした写真と文人・旅人の文章の
 * 展示)、小梨平キャンプ場(河童橋から徒歩5分、自然林に囲まれた
 * キャンプ場)、上高地インフォメーションセンター(バスターミナル隣、
 * 交通・施設情報の提供、2階ギャラリー): kamikochi-vc.or.jp等
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TAISHOIKE_FROM = "沢渡か平湯でバスかタクシーに乗り換え、今日はまず大正池から上高地の散策を始めます。";
const TAISHOIKE_TO =
  "松本駅からバスで沢渡まで、または高山方面からは平湯まで来て、そこでシャトルバスかタクシーに乗り換え、今日はまず大正池から上高地の散策を始めます。";

const WESTON_FROM = "この後は、河童橋を通り抜け、歩いておよそ70分、明神池・穂高神社奥宮へ向かいましょう。";
const WESTON_TO =
  "上高地の遊歩道は、クマが出ることもあります。クマよけの鈴を身につけ、決められた道を外れず、もし出会ったら、あわてず静かにその場を離れましょう。この後は、河童橋を通り抜け、歩いておよそ70分、明神池・穂高神社奥宮へ向かいましょう。";


const KAPPABASHI_END_FROM =
  "今日歩いた道のりを振り返りながら、橋のたもとで最後のひとときを過ごしたら、バスターミナルから沢渡か平湯行きのバスで帰りましょう。なお、上高地は冬季は閉鎖されるため、お出かけ前に最新情報をご確認ください。";
const KAPPABASHI_END_TO =
  "今日歩いた道のりを振り返りながら、橋のたもとでひとときを過ごしましょう。なお、上高地は冬季は閉鎖されるため、お出かけ前に最新情報を確かめましょう。この後は、歩いておよそ3分、上高地ビジターセンターへ向かいましょう。";

const VISITOR_CENTER_MEMO =
  "河童橋から歩いておよそ3分、小梨平の入口にある上高地ビジターセンターに着きます。環境省が運営する施設で、上高地の自然に関する展示や映像の上映を通して、理解を深められる公共施設です。「山に向かう心」をテーマに、写真と文人・旅人の文章を組み合わせた展示が見どころで、レクチャーホールやミュージアムショップも備えています。この後は、歩いてすぐ、小梨平キャンプ場へ向かいましょう。";

const KONASHIDAIRA_MEMO =
  "上高地ビジターセンターから歩いてすぐ、小梨平キャンプ場に着きます。上高地の自然林に囲まれたキャンプ場で、テントサイトのほか、ケビンでの宿泊もできます。木々の間を抜ける散策路や、梓川沿いの静かな雰囲気を味わいながら、キャンプ場ならではの自然の中を歩いてみましょう。この後は、歩いておよそ9分、上高地インフォメーションセンターへ向かいましょう。";

const INFO_CENTER_MEMO =
  "小梨平キャンプ場から歩いておよそ9分、この旅の締めくくり、上高地バスターミナルのそばにある上高地インフォメーションセンターに着きます。上高地の自然や登山、交通、施設の情報を提供する施設で、2階のギャラリーでは写真展などのイベントも開かれています。今日歩いた上高地の一日を振り返りながら、帰りのバスの時間まで過ごしましょう。バスターミナルから、沢渡か平湯行きのバスで帰りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '84dca3bf%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const taishoike = await findSpotInItinerary(itinId, { spotName: "大正池" });
  const kappabashi = await findSpotInItinerary(itinId, { spotName: "河童橋" });
  const weston = await findSpotInItinerary(itinId, { spotName: "ウェストン碑" });

  if (!taishoike.memo!.includes(TAISHOIKE_FROM)) throw new Error("大正池の文言が想定外です");
  if (!kappabashi.memo!.includes(KAPPABASHI_END_FROM)) throw new Error("河童橋の文言が想定外です");
  if (!weston.memo!.includes(WESTON_FROM)) throw new Error("ウェストン碑の文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    { id: taishoike.id, data: { memo: taishoike.memo!.replace(TAISHOIKE_FROM, TAISHOIKE_TO) } },
    { id: (await findSpotInItinerary(itinId, { spotName: "田代池" })).id, data: {} },
    { id: weston.id, data: { memo: weston.memo!.replace(WESTON_FROM, WESTON_TO) } },
    { id: (await findSpotInItinerary(itinId, { spotName: "明神池・穂高神社奥宮" })).id, data: {} },
    {
      id: kappabashi.id,
      data: {
        memo: kappabashi.memo!.replace(KAPPABASHI_END_FROM, KAPPABASHI_END_TO),
        lat: 36.2488436,
        lng: 137.6378366,
        stayDurationMin: 40,
      },
    },
    {
      create: {
        name: "上高地ビジターセンター",
        address: "長野県松本市安曇上高地",
        lat: 36.2496096,
        lng: 137.6394575,
        memo: VISITOR_CENTER_MEMO,
        visitTime: t(15, 23),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    {
      create: {
        name: "小梨平キャンプ場",
        address: "長野県松本市安曇上高地",
        lat: 36.2505817,
        lng: 137.6403807,
        memo: KONASHIDAIRA_MEMO,
        visitTime: t(15, 55),
        stayDurationMin: 22,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      create: {
        name: "上高地インフォメーションセンター",
        address: "長野県松本市安曇上高地4468",
        lat: 36.2464755,
        lng: 137.6356498,
        memo: INFO_CENTER_MEMO,
        visitTime: t(16, 26),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 9,
        transitLine: null,
      },
    },
  ];

  await setDaySpotOrder(day1.id, day1Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

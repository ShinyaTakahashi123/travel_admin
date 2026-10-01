/**
 * #113 79db7413(函館・大沼公園)のDay1組み直し。企画運営の指示
 * (10/1 14:09)にもとづき、大沼国定公園(既存)に大沼遊船・鹿部間歇泉を
 * 追加し、五稜郭公園の「約1500本」の disputed な数字を柔らかい表現に
 * 直した。
 *
 * 大沼国定公園(既存)→大沼遊船(新規)→鹿部間歇泉(新規)→五稜郭公園(既存)
 * →五稜郭タワー(既存)、09:00〜15:19。
 *
 * 【未解決】5か所・妥当な滞在時間で組んでも15:19までにしかならず、
 * 16:30に届かない。大沼・鹿部エリアは地理的に函館市街から離れており、
 * これ以上近くに足せる、座標の裏付けが取れる行き先が見当たらない
 * (大沼公園駅周辺の「昭和寺」は座標は確認できたが、来歴の裏付けが
 * 弱いため見送った)。企画運営に相談予定。
 *
 * 事実確認(開いたURL、検索結果の要約):
 * - 大沼遊船: OSM(amenity=boat_rental)で実在確認。大沼湖上をめぐる
 *   遊覧船
 * - 鹿部間歇泉(道の駅しかべ間歇泉公園): 約10分間隔で15m以上の高さまで
 *   噴き上がる温泉、温度は約100〜113度、足湯もある: town.shikabe.lg.jp等
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const ONUMA_YUSEN_MEMO =
  "大沼国定公園から歩いておよそ7分、大沼遊船の乗り場に着きます。大沼・小沼・蓴菜沼という3つの湖沼をめぐる遊覧船で、湖上から駒ヶ岳や、大小126もの島々を眺められます。陸からの散策とはまた違う、水の上ならではの景色を楽しめます。この後は、車でおよそ22分、鹿部間歇泉へ向かいましょう。";

const SHIKABE_MEMO =
  "大沼遊船から車でおよそ22分、鹿部間歇泉に着きます。「道の駅しかべ間歇泉公園」内にある間歇泉で、およそ100度を超える温泉が、およそ10分おきに高さ15m以上まで勢いよく噴き上がります。間歇泉を利用した足湯もあるので、旅の途中にひと休みするのにもぴったりです。道の駅には食事処や物産館もあるので、ここで昼食にしましょう。この後は、車でおよそ40分、五稜郭公園へ向かいましょう。";

const ONUMA_FROM = "旅の初日は、この大きな自然でゆったりと過ごしてから函館市街へ向かいましょう。";
const ONUMA_TO = "この後は、歩いておよそ7分、大沼遊船へ向かいましょう。";

const GORYOKAKU_KOEN_FROM_OPENER = "函館観光で欠かせない、星形の堀が印象的な史跡です。";
const GORYOKAKU_KOEN_TO_OPENER = "鹿部間歇泉から車でおよそ40分、函館観光で欠かせない、星形の堀が印象的な五稜郭公園に着きます。";

const GORYOKAKU_KOEN_FROM = "1914年（大正3年）に一般公開の公園として開放されて以降、約1500本のソメイヨシノが咲く桜の名所としても親しまれています。";
const GORYOKAKU_KOEN_TO =
  "1914年（大正3年）に一般公開の公園として開放されて以降、多くのソメイヨシノが咲く桜の名所としても親しまれています。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '79db7413%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const onuma = await findSpotInItinerary(itinId, { spotName: "大沼国定公園" });
  const goryokakuKoen = await findSpotInItinerary(itinId, { spotName: "五稜郭公園" });
  const goryokakuTower = await findSpotInItinerary(itinId, { spotName: "五稜郭タワー" });

  if (!goryokakuKoen.memo!.includes(GORYOKAKU_KOEN_FROM)) throw new Error("五稜郭公園の文言が想定外です");
  if (!onuma.memo!.includes(ONUMA_FROM)) throw new Error("大沼国定公園の文言が想定外です");
  if (!goryokakuKoen.memo!.includes(GORYOKAKU_KOEN_FROM_OPENER)) throw new Error("五稜郭公園の書き出しが想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    { id: onuma.id, data: { memo: onuma.memo!.replace(ONUMA_FROM, ONUMA_TO) } },
    {
      create: {
        name: "大沼遊船",
        address: "北海道亀田郡七飯町大沼町1023",
        lat: 41.9842136,
        lng: 140.6735996,
        memo: ONUMA_YUSEN_MEMO,
        visitTime: t(10, 47),
        stayDurationMin: 45,
        transitMode: "walk",
        transitDurationMin: 7,
        transitLine: null,
      },
    },
    {
      create: {
        name: "鹿部間歇泉",
        address: "北海道茅部郡鹿部町字鹿部18-1",
        lat: 42.0288598,
        lng: 140.8305605,
        memo: SHIKABE_MEMO,
        visitTime: t(11, 54),
        stayDurationMin: 50,
        transitMode: "car",
        transitDurationMin: 22,
        transitLine: null,
      },
    },
    {
      id: goryokakuKoen.id,
      data: {
        memo: goryokakuKoen
          .memo!.replace(GORYOKAKU_KOEN_FROM_OPENER, GORYOKAKU_KOEN_TO_OPENER)
          .replace(GORYOKAKU_KOEN_FROM, GORYOKAKU_KOEN_TO),
        visitTime: t(13, 24),
        stayDurationMin: 55,
        transitMode: "car",
        transitDurationMin: 40,
        transitLine: null,
      },
    },
    {
      id: goryokakuTower.id,
      data: { visitTime: t(14, 19), stayDurationMin: 55 },
    },
  ];

  await setDaySpotOrder(day1.id, day1Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

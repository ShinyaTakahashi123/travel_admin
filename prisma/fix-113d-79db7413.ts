/**
 * #113 79db7413の直し(4回目)。企画運営(15:27)と法務(15:29)の指摘に対応。
 *
 * 企画運営:
 * 1. 函館駅でレンタカーを借りて大沼へ向かう形に統一(電車の記述を外す)。
 *    レンタカーは五稜郭タワー見学後、宿へ向かう前に返却する形にした
 * 2. 五稜郭タワーの75分を45分に短縮し、空いた時間で箱館奉行所
 *    (五稜郭公園内の復元建物)を追加
 * 3. 座標の丸め値を直す(五稜郭公園・五稜郭タワー・金森赤レンガ倉庫)
 *
 * 法務:
 * ①「大沼遊船」(会社名)を「大沼の遊覧船」に変更、揺れ・手すりの一文追加
 * ②鹿部間歇泉に、やけど注意(柵の内側に入らない)・足湯の配慮の一文追加
 * ③まちづくりセンターの「丸井今井百貨店」(現存する会社名)を外す
 * ④八幡坂(石畳・冬は凍る)に足元の一文追加
 * ⑤函館朝市・旧函館区公会堂の座標をOSMの点に修正
 * ⑥ハリストス正教会「手を合わせましょう」→「静かに、敬意をもって
 *   見学しましょう」
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const ONUMA_FROM = "JR函館駅から大沼公園駅まで電車で約25分、北海道らしい雄大な自然が広がる公園です。";
const ONUMA_TO = "函館駅前でレンタカーを借りて、大沼国定公園まで車でおよそ40分。北海道らしい雄大な自然が広がる公園です。";

const ONUMA_END_FROM = "この後は、歩いておよそ7分、大沼遊船へ向かいましょう。";
const ONUMA_END_TO = "この後は、歩いておよそ7分、遊覧船の乗り場へ向かいましょう。";

const YUSEN_FROM =
  "大沼国定公園から歩いておよそ7分、大沼遊船の乗り場に着きます。大沼・小沼・蓴菜沼という3つの湖沼をめぐる遊覧船で、湖上から駒ヶ岳や、大小126もの島々を眺められます。陸からの散策とはまた違う、水の上ならではの景色を楽しめます。この後は、車でおよそ22分、鹿部間歇泉へ向かいましょう。";
const YUSEN_TO =
  "大沼国定公園から歩いておよそ7分、遊覧船の乗り場に着きます。大沼・小沼・蓴菜沼という3つの湖沼をめぐる遊覧船で、湖上から駒ヶ岳や、大小126もの島々を眺められます。陸からの散策とはまた違う、水の上ならではの景色を楽しめます。船は揺れることがあるので、手すりにつかまって過ごしましょう。この後は、車でおよそ22分、鹿部間歇泉へ向かいましょう。";

const SHIKABE_FROM =
  "大沼遊船から車でおよそ22分、鹿部間歇泉に着きます。「道の駅しかべ間歇泉公園」内にある間歇泉で、およそ100度を超える温泉が、およそ10分おきに高さ15m以上まで勢いよく噴き上がります。間歇泉を利用した足湯もあるので、旅の途中にひと休みするのにもぴったりです。道の駅には食事処や物産館もあるので、ここで昼食にしましょう。この後は、車でおよそ40分、五稜郭公園へ向かいましょう。";
const SHIKABE_TO =
  "遊覧船の乗り場から車でおよそ22分、鹿部間歇泉に着きます。「道の駅しかべ間歇泉公園」内にある間歇泉で、およそ100度を超える温泉が、およそ10分おきに高さ15m以上まで勢いよく噴き上がります。やけどをしないよう、柵の内側には入らないようにしましょう。間歇泉を利用した足湯もあり、ほかの利用者が写り込まないよう気をつけ、長く浸かりすぎないようにしながら、旅の途中にひと休みするのにもぴったりです。道の駅には食事処や物産館もあるので、ここで昼食にしましょう。この後は、車でおよそ40分、五稜郭公園へ向かいましょう。";

const TOWER_FROM = "先ほど歩いた堀の全景を、今度は上空から確かめてみましょう。今夜は函館市内の宿に泊まり、旅の疲れを癒やしましょう。";
const TOWER_TO =
  "先ほど歩いた堀の全景を、今度は上空から確かめてみましょう。レンタカーは、ここまでに返却しておきましょう。今夜は函館市内の宿に泊まり、旅の疲れを癒やしましょう。";

const BUGYOSHO_MEMO =
  "五稜郭公園から歩いておよそ3分、箱館奉行所に着きます。江戸時代末期、五稜郭の築造とあわせて移転新築された奉行所の庁舎で、箱館戦争ののちに解体されましたが、平成22年(2010)、およそ140年ぶりに部分復元されました。もとの庁舎全体およそ3000平方メートルのうち、正面玄関と太鼓櫓のある大棟、大広間や表座敷、役人の執務室など、およそ3分の1にあたる部分が木造で立体的に復元されています。宮大工をはじめ、全国から集められた職人の技が光る建物を、じっくり見学しましょう。この後は、歩いておよそ5分、五稜郭タワーへ向かいましょう。";

const MACHISENTER_FROM = "大正12年(1923)、丸井今井百貨店の函館支店として建てられた、鉄筋コンクリート造の建物です。";
const MACHISENTER_TO = "大正12年(1923)、百貨店の函館支店として建てられた、鉄筋コンクリート造の建物です。";

const HACHIMANZAKA_FROM = "坂の上から港を見下ろすと、停泊する摩周丸の姿も見える、函館を代表する景観のひとつです。";
const HACHIMANZAKA_TO =
  "坂の上から港を見下ろすと、停泊する摩周丸の姿も見える、函館を代表する景観のひとつです。石畳の坂道は、冬は凍って滑りやすくなるので、足元に注意して歩きましょう。";

const HARISUTOSU_FROM = "参拝の際は、敬意を込めて手を合わせましょう。";
const HARISUTOSU_TO = "見学の際は、静かに、敬意をもって過ごしましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '79db7413%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const onuma = await findSpotInItinerary(itinId, { spotName: "大沼国定公園" });
  const onumaYusen = await findSpotInItinerary(itinId, { spotName: "大沼遊船" });
  const shikabe = await findSpotInItinerary(itinId, { spotName: "鹿部間歇泉" });
  const goryokakuKoen = await findSpotInItinerary(itinId, { spotName: "五稜郭公園" });
  const goryokakuTower = await findSpotInItinerary(itinId, { spotName: "五稜郭タワー" });
  const asaichi = await findSpotInItinerary(itinId, { spotName: "函館朝市" });
  const akarenga = await findSpotInItinerary(itinId, { spotName: "金森赤レンガ倉庫" });
  const machicenter = await findSpotInItinerary(itinId, { spotName: "函館市地域交流まちづくりセンター" });
  const kokaido = await findSpotInItinerary(itinId, { spotName: "旧函館区公会堂" });
  const hachimanzaka = await findSpotInItinerary(itinId, { spotName: "八幡坂" });
  const harisutosu = await findSpotInItinerary(itinId, { spotName: "函館ハリストス正教会" });

  for (const [name, spot, from] of [
    ["大沼国定公園", onuma, ONUMA_FROM],
    ["大沼国定公園(結び)", onuma, ONUMA_END_FROM],
    ["大沼遊船", onumaYusen, YUSEN_FROM],
    ["鹿部間歇泉", shikabe, SHIKABE_FROM],
    ["五稜郭タワー", goryokakuTower, TOWER_FROM],
    ["まちづくりセンター", machicenter, MACHISENTER_FROM],
    ["八幡坂", hachimanzaka, HACHIMANZAKA_FROM],
    ["ハリストス正教会", harisutosu, HARISUTOSU_FROM],
  ] as const) {
    if (!spot.memo!.includes(from)) throw new Error(`${name}の文言が想定外です`);
  }
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    { id: onuma.id, data: { memo: onuma.memo!.replace(ONUMA_FROM, ONUMA_TO).replace(ONUMA_END_FROM, ONUMA_END_TO) } },
    { id: onumaYusen.id, data: { name: "大沼の遊覧船", memo: YUSEN_TO } },
    { id: shikabe.id, data: { memo: SHIKABE_TO } },
    {
      id: goryokakuKoen.id,
      data: { lat: 41.7969004, lng: 140.7571559, visitTime: t(14, 19), stayDurationMin: 55, transitDurationMin: 40 },
    },
    {
      create: {
        name: "箱館奉行所",
        address: "北海道函館市五稜郭町44",
        lat: 41.796933,
        lng: 140.7567258,
        memo: BUGYOSHO_MEMO,
        visitTime: t(15, 17),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    {
      id: goryokakuTower.id,
      data: {
        memo: goryokakuTower.memo!.replace(TOWER_FROM, TOWER_TO),
        lat: 41.7945919,
        lng: 140.7539587,
        visitTime: t(15, 57),
        stayDurationMin: 45,
        transitDurationMin: 5,
      },
    },
  ];

  await setDaySpotOrder(day1.id, day1Spots);

  await updateSpotInItinerary(itinId, { spotId: asaichi.id }, { lat: 41.7722393, lng: 140.724817 });
  await updateSpotInItinerary(itinId, { spotId: akarenga.id }, { lat: 41.7663069, lng: 140.7168435 });
  await updateSpotInItinerary(itinId, { spotId: kokaido.id }, { lat: 41.765038, lng: 140.708921 });
  await updateSpotInItinerary(itinId, { spotId: machicenter.id }, { memo: machicenter.memo!.replace(MACHISENTER_FROM, MACHISENTER_TO) });
  await updateSpotInItinerary(itinId, { spotId: hachimanzaka.id }, { memo: hachimanzaka.memo!.replace(HACHIMANZAKA_FROM, HACHIMANZAKA_TO) });
  await updateSpotInItinerary(itinId, { spotId: harisutosu.id }, { memo: harisutosu.memo!.replace(HARISUTOSU_FROM, HARISUTOSU_TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

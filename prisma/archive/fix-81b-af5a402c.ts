/**
 * #81 af5a402c（仙台市博物館と牛たん通り）ユーザー決定「全部直す」の対象。
 * D1は既に09:30〜16:53で窓内だが、flow-checkで瑞鳳殿に「宿の一言」がなかった
 * ため追加。D2は現状09:30〜15:34(牛たん通り・すし通りの滞在100分は長め)で
 * 窓に届かず。滞在を延ばさず(決まりA)、牛たん通りを70分(実際に食事+散策で
 * 過ごせる長さ)に短縮し、そのあとに榴岡公園(実在、園内の仙台市歴史民俗資料館
 * は明治7年[1874]築の旧陸軍兵舎を利用した宮城県内最古とされる洋風木造建築、
 * OSM way 61488987)を追加。移動はOSM歩行者ルーティング実測(牛たん通り→
 * 榴岡公園 1.95km/26分)。開館時間(9:00-16:45、最終入館16:15、公式サイトで
 * 確認)内に収まるよう配置。あわせてSS30の「旅の締めくくり前に」という文言
 * (牛たん通りがまだ最後のスポットだった頃の名残で、今回さらに最後ではなく
 * なる)を削除し、牛たん通りに「昼食」の一言を追加(flow-checkの指摘)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const ZUIHODEN_FROM =
  "仙台東照宮から輪王寺、大崎八幡宮、伊達家ゆかりの地をめぐった歴史をたどる1日目は、ここで終了です。お疲れさまでした。";
const ZUIHODEN_TO =
  "仙台東照宮から輪王寺、大崎八幡宮、伊達家ゆかりの地をめぐった歴史をたどる1日目は、ここで終了です。お疲れさまでした。今夜は仙台市内の宿でゆっくりお休みください。";

const SS30_FROM = "旅の締めくくり前に、少し高いところから仙台の街を一望してみましょう。";
const SS30_TO = "少し高いところから、仙台の街を一望してみましょう。";

const GYUTAN_FROM =
  "数ある店の中から好みの一軒を選んで、旅の締めくくりに仙台グルメを味わってみてください。仙台の建築と並木道、市場とグルメをめぐった2日目も、ここで無事に終了です。お疲れさまでした。";
const GYUTAN_TO =
  "数ある店の中から好みの一軒を選んで、ここで遅めの昼食に仙台グルメを味わってみてください。この後は、歩いておよそ26分、榴岡公園へ向かいましょう。";

const TSUTSUJIGAOKA_MEMO =
  "牛たん通り・すし通りから歩いておよそ26分、榴岡公園に着きます。江戸時代には歌枕としても知られた桜の名所で、今も春には多くの花見客でにぎわう、仙台市民に親しまれた公園です。園内には、明治7年(1874)に建てられた旧陸軍兵舎を利用した仙台市歴史民俗資料館があり、現存する宮城県内最古の洋風木造建築とされ、仙台市の有形文化財に指定されています。「仙台地方の農具と農家のくらし」「仙台町場のくらし」「旧歩兵第四連隊関連」など、仙台の暮らしと歴史を伝える展示を見学できます。休館日は公式サイトで確かめてから訪れましょう。公園の散策とあわせて、ゆっくりとお楽しみください。杜の都・仙台の歴史と文化をめぐった2日目の旅も、ここで終了です。お疲れさまでした。お帰りは、JR仙台駅からご利用ください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'af5a402c%'`);
  const itinId = rows[0].id;

  // D1: 瑞鳳殿に宿の一言を追加
  const zuihoden = await findSpotInItinerary(itinId, { spotName: "瑞鳳殿" });
  if (!zuihoden.memo!.includes(ZUIHODEN_FROM)) throw new Error("一致しません(瑞鳳殿)");
  const zuihodenNewMemo = zuihoden.memo!.split(ZUIHODEN_FROM).join(ZUIHODEN_TO);

  // D2: SS30と牛たん通りの文言修正、榴岡公園を新規追加
  const ss30 = await findSpotInItinerary(itinId, { spotName: "SS30展望フロア" });
  if (!ss30.memo!.includes(SS30_FROM)) throw new Error("一致しません(SS30)");
  const ss30NewMemo = ss30.memo!.split(SS30_FROM).join(SS30_TO);

  const gyutan = await findSpotInItinerary(itinId, { spotName: "牛たん通り・すし通り" });
  if (!gyutan.memo!.includes(GYUTAN_FROM)) throw new Error("一致しません(牛たん通り)");
  const gyutanNewMemo = gyutan.memo!.split(GYUTAN_FROM).join(GYUTAN_TO);

  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });
  const day2Spots: SpotOrderItem[] = [
    { id: "64255c90-2aff-4406-95fd-1ed1ad4646a0", data: {} }, // せんだいメディアテーク
    { id: "6f76a6fd-0ac3-4ac2-90eb-2ee8b1ab1043", data: {} }, // 定禅寺通り
    { id: "4d8e8f66-fa4f-43c5-a593-e9d6d23ede2a", data: {} }, // 仙台朝市
    { id: "a81107c0-d39d-454b-98ad-72cdebf68532", data: { memo: ss30NewMemo } }, // SS30展望フロア
    {
      id: "8623d44b-2337-46e3-ba60-7b5bf05b64ef", // 牛たん通り・すし通り
      data: { memo: gyutanNewMemo, stayDurationMin: 70 },
    },
    {
      create: {
        name: "榴岡公園",
        address: "宮城県仙台市宮城野区五輪1丁目",
        lat: 38.2603134,
        lng: 140.8968775,
        memo: TSUTSUJIGAOKA_MEMO,
        visitTime: t(15, 30),
        stayDurationMin: 65,
        transitMode: "walk",
        transitDurationMin: 26,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const knownStay: Record<string, number> = {
    "64255c90-2aff-4406-95fd-1ed1ad4646a0": 70,
    "6f76a6fd-0ac3-4ac2-90eb-2ee8b1ab1043": 70,
    "4d8e8f66-fa4f-43c5-a593-e9d6d23ede2a": 55,
    "a81107c0-d39d-454b-98ad-72cdebf68532": 35,
  };
  let prevEnd = -1;
  for (const x of day2Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = (d.stayDurationMin as number | undefined) ?? ("id" in x ? knownStay[x.id] : undefined);
    if (!vt) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    if (st != null) prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(itinId, { spotId: zuihoden.id }, { memo: zuihodenNewMemo }, { tx });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

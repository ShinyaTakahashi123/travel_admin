/**
 * #10 54f0fa20の直し(7回目)。itinerary-audit/flow-checkの指摘(自己点検):
 * - Day1最後の姫路文学館に宿の一言がない
 * - Day2最後の手柄山平和公園に帰りの一言がない
 * - Day2に昼食の一言がない
 * - 日本城郭研究センター→好古園の移動(0.3km/15分)が遅すぎる(日本城郭
 *   研究センターの座標は国土地理院の番地の推定点のため、より現実的な
 *   時間に修正)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const BUNGAKUKAN_FROM = "姫路の旅1日目の締めくくりに、静かな時間を過ごしましょう。";
const BUNGAKUKAN_TO = "姫路の旅1日目の締めくくりに、静かな時間を過ごしましょう。今夜は姫路駅周辺の宿に泊まりましょう。";

const SUIZOKUKAN_FROM = "播磨地方の川や瀬戸内海に暮らす生き物を中心に展示していて、ウミガメのエサやりなど体験プログラムも人気です。";
const SUIZOKUKAN_TO =
  "播磨地方の川や瀬戸内海に暮らす生き物を中心に展示していて、ウミガメのエサやりなど体験プログラムも人気です。館内のレストランで昼食をとることもできます。";

const HEIWAKOEN_FROM = "緑豊かな公園を、姫路の旅2日間の締めくくりに、静かに歩いてみましょう。";
const HEIWAKOEN_TO =
  "緑豊かな公園を、姫路の旅2日間の締めくくりに、静かに歩いてみましょう。ここから姫路駅までバスで戻り、帰りの電車に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '54f0fa20%'`);
  const itinId = rows[0].id;

  const bungakukan = await findSpotInItinerary(itinId, { spotName: "姫路文学館" });
  const suizokukan = await findSpotInItinerary(itinId, { spotName: "姫路市立水族館" });
  const heiwakoen = await findSpotInItinerary(itinId, { spotName: "手柄山平和公園" });
  const kokoen = await findSpotInItinerary(itinId, { spotName: "好古園" });
  const otokoyama = await findSpotInItinerary(itinId, { spotName: "男山配水池公園" });
  const zoo = await findSpotInItinerary(itinId, { spotName: "姫路市立動物園" });

  if (!bungakukan.memo?.includes(BUNGAKUKAN_FROM)) throw new Error("文学館の文言が想定外です");
  if (!suizokukan.memo?.includes(SUIZOKUKAN_FROM)) throw new Error("水族館の文言が想定外です");
  if (!heiwakoen.memo?.includes(HEIWAKOEN_FROM)) throw new Error("手柄山平和公園の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: bungakukan.id }, { memo: bungakukan.memo!.replace(BUNGAKUKAN_FROM, BUNGAKUKAN_TO) });
  await updateSpotInItinerary(itinId, { spotId: suizokukan.id }, { memo: suizokukan.memo!.replace(SUIZOKUKAN_FROM, SUIZOKUKAN_TO) });
  await updateSpotInItinerary(itinId, { spotId: heiwakoen.id }, { memo: heiwakoen.memo!.replace(HEIWAKOEN_FROM, HEIWAKOEN_TO) });
  await updateSpotInItinerary(
    itinId,
    { spotId: kokoen.id },
    { transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7, transitLine: null }] } }
  );
  await updateSpotInItinerary(itinId, { spotId: kokoen.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 22)) });
  await updateSpotInItinerary(itinId, { spotId: otokoyama.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 8)) });
  await updateSpotInItinerary(itinId, { spotId: zoo.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 5)) });
  await updateSpotInItinerary(itinId, { spotId: bungakukan.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 16, 5)) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

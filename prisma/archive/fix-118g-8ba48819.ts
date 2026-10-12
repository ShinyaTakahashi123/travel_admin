/**
 * #118 8ba48819の直し(7回目)。前回(fix-118f)で長瀬家・神田家・和田家の
 * 順番を入れ替えたが、visitTimeは正しく直したものの、transitDurationMin
 * (申告の移動分数)を直し忘れていた。実際の距離にあわせて直す。
 * 明善寺郷土館→長瀬家: 3分(以前は神田家からの1分のまま残っていた)
 * 長瀬家→神田家: 1分(以前は明善寺郷土館からの3分のまま残っていた)
 * 神田家→和田家: 4分(以前は長瀬家からの5分のまま残っていた)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '8ba48819%'`);
  const itinId = rows[0].id;
  const nagaseke = await findSpotInItinerary(itinId, { spotName: "長瀬家" });
  const kandake = await findSpotInItinerary(itinId, { spotName: "神田家" });
  const wadake = await findSpotInItinerary(itinId, { spotName: "和田家" });

  console.log("現在:", nagaseke.transitDurationMin, kandake.transitDurationMin, wadake.transitDurationMin);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: nagaseke.id }, { transitDurationMin: 3 });
  await updateSpotInItinerary(itinId, { spotId: kandake.id }, { transitDurationMin: 1 });
  await updateSpotInItinerary(itinId, { spotId: wadake.id }, { transitDurationMin: 4 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

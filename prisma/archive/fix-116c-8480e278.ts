/**
 * #116 8480e278の直し(3回目)。会津民俗館の終わり(12:53)+移動7分=13:00
 * のところ、天鏡閣のvisitTimeが12:59で1分ずれていたため修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '8480e278%'`);
  const itinId = rows[0].id;
  const tenkyokaku = await findSpotInItinerary(itinId, { spotName: "天鏡閣" });

  console.log("現在:", tenkyokaku.visitTime);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: tenkyokaku.id }, { visitTime: t(13, 0) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

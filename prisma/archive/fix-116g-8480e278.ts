/**
 * #116 8480e278の直し(7回目)。会津民俗館のvisitTime(13:10)が、野口
 * 英世記念館の終わり(13:08)+移動3分=13:11と1分ずれていたため修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '8480e278%'`);
  const itinId = rows[0].id;
  const minzokukan = await findSpotInItinerary(itinId, { spotName: "会津民俗館" });

  console.log("現在:", minzokukan.visitTime);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: minzokukan.id }, { visitTime: t(13, 11) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

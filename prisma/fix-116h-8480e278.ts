/**
 * #116 8480e278の直し(8回目)。会津民俗館の終わりが13:46に変わった
 * ため、土津神社のvisitTime(13:54)が1分ずれた。13:55に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '8480e278%'`);
  const itinId = rows[0].id;
  const hanitsu = await findSpotInItinerary(itinId, { spotName: "土津神社" });

  console.log("現在:", hanitsu.visitTime);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: hanitsu.id }, { visitTime: t(13, 55) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

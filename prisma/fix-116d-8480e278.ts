/**
 * #116 8480e278の直し(4回目)。天鏡閣の終わりが13:55に変わったため、
 * 諸橋近代美術館のvisitTime(14:19)が1分ずれた。14:20に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '8480e278%'`);
  const itinId = rows[0].id;
  const morohashi = await findSpotInItinerary(itinId, { spotName: "諸橋近代美術館" });

  console.log("現在:", morohashi.visitTime);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: morohashi.id }, { visitTime: t(14, 20) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

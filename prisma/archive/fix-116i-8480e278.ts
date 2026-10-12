/**
 * #116 8480e278の直し(9回目)。土津神社の終わりが14:30に変わったため、
 * 諸橋近代美術館のvisitTime(14:45→14:46)と、連動して磐梯山噴火記念館
 * のvisitTime(16:04→16:05)も1分ずつずれていたため修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '8480e278%'`);
  const itinId = rows[0].id;
  const morohashi = await findSpotInItinerary(itinId, { spotName: "諸橋近代美術館" });
  const funka = await findSpotInItinerary(itinId, { spotName: "磐梯山噴火記念館" });

  console.log("現在:", morohashi.visitTime, funka.visitTime);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: morohashi.id }, { visitTime: t(14, 46) });
  await updateSpotInItinerary(itinId, { spotId: funka.id }, { visitTime: t(16, 5) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

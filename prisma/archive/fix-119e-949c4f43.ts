/**
 * #119 949c4f43の直し(5回目)。弓張岳展望台の滞在を40→45分にした際、
 * 下流の時刻を直し忘れていた。海上自衛隊佐世保史料館と、西海橋の
 * あとのパレスハウステンボスのvisitTimeがそれぞれ5分ずれていたため
 * 修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '949c4f43%'`);
  const itinId = rows[0].id;
  const sailtower = await findSpotInItinerary(itinId, { spotName: "海上自衛隊佐世保史料館" });
  const palace = await findSpotInItinerary(itinId, { spotName: "パレスハウステンボス" });

  console.log("現在:", sailtower.visitTime, palace.visitTime);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: sailtower.id }, { visitTime: t(9, 55) });
  await updateSpotInItinerary(itinId, { spotId: palace.id }, { visitTime: t(13, 53) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

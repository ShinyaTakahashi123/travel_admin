/**
 * #116 8480e278の直し(5回目)。諸橋近代美術館の終わりが15:35に変わった
 * ため、磐梯山噴火記念館のvisitTime(15:38)が1分ずれた。15:39に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '8480e278%'`);
  const itinId = rows[0].id;
  const funka = await findSpotInItinerary(itinId, { spotName: "磐梯山噴火記念館" });

  console.log("現在:", funka.visitTime);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: funka.id }, { visitTime: t(15, 39) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

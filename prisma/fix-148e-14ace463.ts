/**
 * #148 14ace463の直し(5回目、自己点検)。fix-148dで荒神神社の
 * transitDurationMinを25→26分に直した際、visitTimeを11:20→11:21に
 * 合わせ忘れていた(ふるさと村の終わり10:55+26分=11:21)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '14ace463%'`);
  const itinId = rows[0].id;
  const gojin = await findSpotInItinerary(itinId, { spotName: "荒神神社" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: gojin.id }, data: { visitTime: t(11, 21) } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

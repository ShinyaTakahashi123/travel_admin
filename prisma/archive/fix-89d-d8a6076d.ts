/**
 * #89 d8a6076d fix-89cで一部コミット済みだったところに、1分のずれがあった。
 * 東山和紙紙すき館のvisitTimeを11:03→11:02に直す(猊鼻渓終了11:00+徒歩2分)。
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary, findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd8a6076d%'`);
  const itinId = rows[0].id;
  const kamisukikan = await findSpotInItinerary(itinId, { spotName: "東山和紙紙すき館" });
  console.log("現在のvisitTime:", kamisukikan.visitTime);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: kamisukikan.id }, { visitTime: t(11, 2) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

/**
 * #128 c9b3ad40の直し(3回目)。自己点検(ccheck)で、内宮の既存座標
 * (34.455, 136.725175)が丸めた値だったことに気づいた。OSM実点
 * (34.4568901, 136.7229780、way 555110597)に修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c9b3ad40%'`);
  const itinId = rows[0].id;
  const naiku = await findSpotInItinerary(itinId, { spotName: "伊勢神宮内宮" });

  console.log("確認OK。現在の座標:", naiku.lat, naiku.lng);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: naiku.id }, { lat: 34.4568901, lng: 136.722978 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

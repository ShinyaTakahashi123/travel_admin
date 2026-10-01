/**
 * #110 76319c13(横浜)の直し。企画運営の座標点検(15:28)で2点指摘。
 * ・氷川丸: 山下公園と同じ座標が使い回されていた(不可)。氷川丸自体の
 *   OSMの点(way 130991780)に直す
 * ・横浜中華街: 丸めた値だった。OSMの点(way 445258887)に直す
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '76319c13%'`);
  const itinId = rows[0].id;
  const hikawamaru = await findSpotInItinerary(itinId, { spotName: "氷川丸" });
  const chukagai = await findSpotInItinerary(itinId, { spotName: "横浜中華街" });

  console.log("氷川丸現在:", hikawamaru.lat, hikawamaru.lng);
  console.log("横浜中華街現在:", chukagai.lat, chukagai.lng);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: hikawamaru.id }, { lat: 35.4466664, lng: 139.6512547 });
  await updateSpotInItinerary(itinId, { spotId: chukagai.id }, { lat: 35.4426638, lng: 139.6451907 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

/**
 * #95 310ab81d 企画運営(2026-10-01 01:16)の指摘。椰子の実記念碑の座標を、
 * 日出の石門から手で150mずらした値にしていたが、これは「手で動かした値」
 * にあたり使えない(推定のときは、近くのOSMの点・道の、その点そのものの
 * 座標を使う決まり)。
 *
 * Overpass(2系統とも接続不可)のため、OSMの生API
 * (https://api.openstreetmap.org/api/0.6/map?bbox=137.035,34.575,137.042,34.580)
 * で日出の石門周辺のデータを取得。日出の石門を通る「田原豊橋自転車道線」
 * (ref 497、OSM way 136052363ほか)という実在の歩行者・自転車専用道路の
 * ノードのうち、日出の石門にもっとも近いもの(node 1493002532、
 * 34.5789721,137.0370199、日出の石門から225m)を、そのままの座標で使う。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '310ab81d%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "椰子の実記念碑" });
  console.log("現在の座標:", spot.lat, spot.lng);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { lat: 34.5789721, lng: 137.0370199 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

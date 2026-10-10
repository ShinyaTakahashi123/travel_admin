/**
 * #24 657f4a15（箱根）企画運営の指摘(2026-09-30 11:34): 座標は「手で動かした値」を
 * 使わない決まり。箱根町港は、これまで箱根関所の座標(35.192206,139.026353)を代替
 * アンカーに使っていたが、OSMに「箱根町港」の実在の点(node 391217634、
 * 35.1899853, 139.0245031)があるため、そちらに直す。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "657f4a15-8f20-4d44-ac20-fa757f002d63";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "箱根町港" });
  console.log("現在:", spot.lat, spot.lng);
  console.log("新規: 35.1899853 139.0245031 (OSM node 391217634)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITIN, { spotId: spot.id }, { lat: 35.1899853, lng: 139.0245031 });
  console.log("COMMITTED");
}
main();

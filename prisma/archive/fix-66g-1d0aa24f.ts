/**
 * #66 1d0aa24f。企画運営の指摘: 諏訪神社の座標が国土地理院の住所検索の地区
 * レベルの点(大字・地区の中心)だったため、これは使えない決まり。Overpassの
 * ミラーサーバーで再検索し、実際の施設の点(OSM way 871809086「諏訪社」)を
 * 見つけたため、座標を差し替える。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "1d0aa24f-a0e8-4319-b97b-86952764c785";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "諏訪神社" });
  console.log("現在の座標:", spot.lat, spot.lng);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITIN, { spotId: spot.id }, { lat: 36.9465679, lng: 138.8013787 });
  console.log("COMMITTED (OSM way 871809086)");
}
main();

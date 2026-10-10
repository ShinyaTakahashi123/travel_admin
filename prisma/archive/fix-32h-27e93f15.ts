/**
 * #32 27e93f15（由布院）新しい6点セルフチェック(2026-09-30 11:38、3セッション共通)の
 * 座標の点で、明礬温泉の湯の花小屋が「明礬温泉」という地域点(実在だが施設そのものでは
 * ない)を使っていたことに気づいたため、Overpassで施設そのものの点を探して差し替える。
 * OSM node 6594460185「湯の華採取見学 無料」(website: yuno-hana.jp/yunohana_koya、
 * 本文で使っている公式サイトと一致)、33.3194238, 131.4541230。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "27e93f15-8dbe-4e72-81d5-7bcde9231b4e";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "明礬温泉 湯の花小屋" });
  console.log("現在:", spot.lat, spot.lng);
  console.log("新規: 33.3194238 131.454123 (OSM node 6594460185)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITIN, { spotId: spot.id }, { lat: 33.3194238, lng: 131.454123 });
  console.log("COMMITTED");
}
main();

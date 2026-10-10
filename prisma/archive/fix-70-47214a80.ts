/**
 * #70 47214a80（竜串海岸・足摺）企画運営の指摘で#66〜82の一括作業のうち先に対応。
 * 白山洞門(D2-4、最後は足摺岬)の「旅の締めくくりのひとときを過ごしてください」
 * (締めくくりの先取り)を、通常の文に直す。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "47214a80-9c61-4b42-bc92-b382de9581eb";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "白山洞門" });
  const from = "足摺の荒々しい海岸美を眺めながら、旅の締めくくりのひとときを過ごしてください。";
  const to = "足摺の荒々しい海岸美を、ゆっくりと眺めてみてください。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("白山洞門: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();

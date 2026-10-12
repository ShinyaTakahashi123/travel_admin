/**
 * #135 e3e32914（門司港レトロ）法務の指摘。門司港レトロ展望室(D1最後)の
 * 「旅の締めくくりに」が1日目なのに旅全体を締めくくる表現になっていたため、
 * 「1日目の締めくくりに」に修正。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "e3e32914-5c7e-4d4c-94ae-c0c0598cdaf1";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "門司港レトロ展望室" });
  const from = "旅の締めくくりに、1日かけて巡った関門海峡の全景をゆっくりと眺めてください。";
  const to = "1日目の締めくくりに、1日かけて巡った関門海峡の全景をゆっくりと眺めてください。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("門司港レトロ展望室: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();

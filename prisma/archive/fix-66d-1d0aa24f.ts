/**
 * #66 1d0aa24f。itinerary-auditの言い切り検知。滝沢公園の結びの「日本三大峡谷」が
 * ヘッジ語を伴わずに検知されたため、この振り返り文では峡谷とだけ言い換える。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "1d0aa24f-a0e8-4319-b97b-86952764c785";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "滝沢公園" });
  const from = "ロープウェイからの絶景、名作の舞台となった温泉街、日本三大峡谷、そして町なかの滝まで、越後湯沢をめぐる今日の旅を、ここで締めくくってください。";
  const to = "ロープウェイからの絶景、名作の舞台となった温泉街、迫力の峡谷、そして町なかの滝まで、越後湯沢をめぐる今日の旅を、ここで締めくくってください。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("滝沢公園: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();

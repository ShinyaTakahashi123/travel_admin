/**
 * #65 1bd66235（浦富海岸・鳥取）企画運営の指摘(14:23)。岩井ゆかむり温泉(Day1最後)の
 * 「今日までの旅をゆっくりと締めくくりましょう」が、1日目なのに「旅」全体を締めくくる
 * 表現になっていたため、日の締めくくり(宿)の表現に修正。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "1bd66235-42eb-4312-a2c0-d013aba8775f";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "岩井ゆかむり温泉" });
  const from = "山陰最古級の湯につかりながら、浦富海岸から続く今日までの旅をゆっくりと締めくくりましょう。今夜はこの近くの宿へ向かいましょう。";
  const to = "山陰最古級の湯につかりながら、今日一日の疲れをゆっくりとほぐしましょう。今夜は岩井温泉の宿でゆっくり休みましょう。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("岩井ゆかむり温泉: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();

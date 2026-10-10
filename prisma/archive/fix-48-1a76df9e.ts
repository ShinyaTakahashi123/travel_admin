/**
 * #48 1a76df9e（水木しげるロード・境港）企画運営の指摘。大漁市場なかうら(D1-6、
 * 最後は弓ヶ浜)の「弓ヶ浜へ向かい、今日の旅を締めくくりましょう」(締めくくりの
 * 先取り)を、普通のつながりの文に直す。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "1a76df9e-e99a-47e0-bbe8-fb01fbe2365b";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "大漁市場なかうら" });
  const from = "この後は、歩いてすぐの弓ヶ浜へ向かい、今日の旅を締めくくりましょう。";
  const to = "この後は、歩いてすぐの弓ヶ浜へ向かいましょう。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("大漁市場なかうら: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();

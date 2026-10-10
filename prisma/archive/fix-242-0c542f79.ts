/**
 * #242 0c542f79（奈良公園・東大寺）企画運営の指摘。興福寺(D1-4、最後は猿沢池)の
 * 「最後は、興福寺のすぐそばにある猿沢池へご案内し、本日の締めくくりといたします」
 * (締めくくりの先取り、過度な敬語口調)を、ほかのしおりと同じ通常の口調のつながりの
 * 文に直す。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "0c542f79-2811-4a59-bfcb-34816ad72c3e";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "興福寺" });
  const from = "最後は、興福寺のすぐそばにある猿沢池へご案内し、本日の締めくくりといたします。";
  const to = "この後は、興福寺のすぐそばにある猿沢池へ向かいましょう。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("興福寺: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();

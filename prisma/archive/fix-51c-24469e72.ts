/**
 * #51 24469e72（いわき）flow-checkで見つかった既存の不足。単日プランに昼食の一言が
 * 一つもなかったため、市場・飲食店が集まるいわき・ら・ら・ミュウ(11:36〜12:51)に追加。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "24469e72-101c-4fcc-99e3-2d736d0c8ffb";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "いわき・ら・ら・ミュウ" });
  const from = "買い物や食事を楽しみながら、小名浜港の活気を感じてみてください。";
  const to = "買い物や食事を楽しみながら、小名浜港の活気を感じてみてください。ここで昼食にするのもおすすめです。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("いわき・ら・ら・ミュウ: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();

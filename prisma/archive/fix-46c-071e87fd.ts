/**
 * #46 071e87fd（嵐山・嵯峨野）法務の指摘。重要伝統的建造物群保存地区は「指定」では
 * なく「選定」が正しい用語のため、嵯峨鳥居本の町並みの表記を修正。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "071e87fd-03f9-4cdd-a3b5-170c62e6a807";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "嵯峨鳥居本の町並み" });
  const from = "国の重要伝統的建造物群保存地区に指定されています。";
  const to = "国の重要伝統的建造物群保存地区に選定されています。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("嵯峨鳥居本の町並み: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();

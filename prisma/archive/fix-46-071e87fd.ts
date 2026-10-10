/**
 * #46 071e87fd（嵐山・嵯峨野）企画運営の指摘。渡月橋(D1-7、最後は大覚寺)の
 * 「1日目の締めくくりは」が、途中に残った古い結びだったため、前のスポット
 * (嵐山モンキーパークいわたやま)からのつながりの文に直す。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "071e87fd-03f9-4cdd-a3b5-170c62e6a807";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "渡月橋" });
  const from = "1日目の締めくくりは、嵐山のシンボルへ。";
  const to = "嵐山モンキーパークいわたやまから歩いておよそ5分、嵐山のシンボル・渡月橋に着きます。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("渡月橋: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();

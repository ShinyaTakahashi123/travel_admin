/**
 * #65 1bd66235（浦富海岸・鳥取）見直し中に見つけた既存の不具合。
 * 鳥取県立博物館の書き出し「鳥取城跡から歩いておよそ3分」が、実際の移動記録(徒歩8分)と
 * 食い違っていた(自分の編集とは無関係の既存データ)。8分に修正。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "1bd66235-42eb-4312-a2c0-d013aba8775f";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "鳥取県立博物館" });
  const from = "鳥取城跡から歩いておよそ3分、鳥取県立博物館に着きます。";
  const to = "鳥取城跡から歩いておよそ8分、鳥取県立博物館に着きます。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("鳥取県立博物館: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();

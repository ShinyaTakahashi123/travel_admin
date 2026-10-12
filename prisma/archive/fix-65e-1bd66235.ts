/**
 * #65 1bd66235（浦富海岸・鳥取）法務の指摘(13:32)。鳥取城跡の結び「歩いておよそ3分」が
 * fix-65dで8分に直した鳥取県立博物館の書き出しと食い違っていたため、8分にそろえる。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "1bd66235-42eb-4312-a2c0-d013aba8775f";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "鳥取城跡" });
  const from = "この後は、歩いておよそ3分、鳥取県立博物館へ向かいましょう。";
  const to = "この後は、歩いておよそ8分、鳥取県立博物館へ向かいましょう。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("鳥取城跡: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();

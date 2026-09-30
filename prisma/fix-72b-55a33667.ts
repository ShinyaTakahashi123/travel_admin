/**
 * #72 55a33667 flow-checkで見つかった不足。ACAO FOREST(D2最後、旅全体の最後)に
 * 帰りの一言がなかったため追加(全編車移動のため車での帰り方に)。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "55a33667-b603-4efa-ad4f-2b5f8e8e2f47";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "ACAO FOREST" });
  const from = "熱海サンビーチの散策から続いた、海と温泉、そして絶景をめぐる1泊2日のリラックス旅も、ここで無事に終了です。お疲れさまでした。";
  const to = "熱海サンビーチの散策から続いた、海と温泉、そして絶景をめぐる1泊2日のリラックス旅も、ここで無事に終了です。お疲れさまでした。お帰りは、駐車場に置いた車でご利用ください。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("ACAO FOREST: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();

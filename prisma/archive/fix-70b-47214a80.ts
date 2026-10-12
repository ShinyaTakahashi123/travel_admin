/**
 * #70 47214a80（竜串海岸・足摺）flow-checkで見つかった既存の不足。D1最後の
 * 大堂海岸に宿への一言がなかったため追加。D2(旅全体)最後の足摺岬に帰りの
 * 一言がなかったため追加(全編車移動のため、車での帰り方に)。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "47214a80-9c61-4b42-bc92-b382de9581eb";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "大堂海岸",
    "竜串海岸から続いた足摺の海中美をめぐる旅も、ここで無事に終了です。お疲れさまでした。",
    "竜串海岸から続いた足摺の海中美をめぐる旅も、ここで無事に終了です。今夜はこの近くの宿でゆっくり休みましょう。お疲れさまでした。"
  );
  await replaceMemo(
    "足摺岬",
    "竜串海岸から続いた足摺の海中美と歴史をめぐる旅も、ここで無事に終了です。お疲れさまでした。",
    "竜串海岸から続いた足摺の海中美と歴史をめぐる旅も、ここで無事に終了です。お疲れさまでした。お帰りは、駐車場に置いた車でご利用ください。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();

/**
 * #68 357983ef flow-checkで見つかった不足。杖立温泉(D2最後、旅全体の最後)に
 * 帰りの一言がなかったため追加(全編車移動のため車での帰り方に)。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "357983ef-fff3-496a-8a92-1f236f8f24bd";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "杖立温泉" });
  const from = "満願寺と満願寺温泉、南小国の古刹と川沿いの湯をめぐる1泊2日の旅も、ここで無事に終了です。お疲れさまでした。";
  const to = "満願寺と満願寺温泉、南小国の古刹と川沿いの湯をめぐる1泊2日の旅も、ここで無事に終了です。お疲れさまでした。お帰りは、駐車場に置いた車でご利用ください。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("杖立温泉: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();

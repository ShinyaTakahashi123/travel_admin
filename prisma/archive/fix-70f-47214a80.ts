/**
 * #70 47214a80。企画運営の指摘: 1日目は竜串まで歩きだが、大堂海岸から車になる。
 * どこで車に乗るかを一言添える(この旅は車でめぐる旨を竜串海岸の本文に明記)。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "47214a80-9c61-4b42-bc92-b382de9581eb";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "竜串海岸" });
  const from = "旅の始まりは竜串海岸です。";
  const to = "旅の始まりは竜串海岸です。竜串周辺は歩いて巡り、大堂海岸から先はレンタカーなどでめぐります。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("竜串海岸: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();

/**
 * #70 47214a80。企画運営の再指摘: 「大堂海岸から先はレンタカーなどで」だと
 * 竜串のあたりで車を借りる形になり現実的でない。最初から車の旅として書き、
 * 竜串周辺は駐車場に車を置いて歩く形に直す。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "47214a80-9c61-4b42-bc92-b382de9581eb";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "竜串海岸" });
  const from = "旅の始まりは竜串海岸です。竜串周辺は歩いて巡り、大堂海岸から先はレンタカーなどでめぐります。";
  const to = "この旅はレンタカーなどでめぐります。旅の始まりは竜串海岸です。竜串周辺は、駐車場に車を置いて歩いてめぐりましょう。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("竜串海岸: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();

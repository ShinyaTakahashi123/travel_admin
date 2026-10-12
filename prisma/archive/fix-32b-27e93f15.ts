/**
 * #32 27e93f15（由布院）fix-32のaudit確認で「言い切り?」が出た点を修正。
 * 城島高原パークの「日本初の木製コースター」は事実として正しい(日本記録認定協会
 * https://japaneserecords.org/japanese-records/18879/ でも確認)が、言い切りを
 * 避ける house convention に合わせてヘッジ語を追加。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "27e93f15-8dbe-4e72-81d5-7bcde9231b4e";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "城島高原パーク" });
  const from = "日本初の木製コースター「ジュピター」をはじめ";
  const to = "日本初とされる木製コースター「ジュピター」をはじめ";
  if (!spot.memo!.includes(from)) throw new Error("一致しません");
  const newMemo = spot.memo!.split(from).join(to);
  console.log("城島高原パーク: OK");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  console.log("COMMITTED");
}
main();

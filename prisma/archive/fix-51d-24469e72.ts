/**
 * #51 24469e72（いわき）法務の指摘。日中は車で移動しているのに、最後だけ
 * 「JR常磐線の湯本駅から」という電車の帰り方になっていて、車をどうするかが
 * 書かれていなかった。車移動の一日として、駐車場に置いた車で帰る形に修正。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "24469e72-101c-4fcc-99e3-2d736d0c8ffb";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "さはこの湯" });
  const from = "お帰りは、JR常磐線「湯本駅」(徒歩およそ10分)からご利用ください。";
  const to = "お帰りは、駐車場に置いた車でご利用ください。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("さはこの湯: OK");
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();

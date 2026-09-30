/**
 * #61 03a50000（小豆島）flow-checkで「帰りの一言なし」を検出。迷路のまちは
 * 土庄港のそばのため、帰りのフェリーの一言を追加する。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "03a50000-32df-4771-a11e-18521fd89703";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "迷路のまち" });
  const from = "寒霞渓の絶景から醤油の町、映画の舞台、オリーブの丘、海峡と砂の道、そして迷路のまちまで、小豆島をめぐる今日の旅を、ここで締めくくりましょう。";
  const to = "寒霞渓の絶景から醤油の町、映画の舞台、オリーブの丘、海峡と砂の道、そして迷路のまちまで、小豆島をめぐる今日の旅を、ここで締めくくりましょう。帰りは車で土庄港へ向かい、フェリーに乗りましょう。";
  if (!spot.memo!.includes(from)) throw new Error("一致しません");
  const newMemo = spot.memo!.split(from).join(to);
  console.log("迷路のまち: OK(帰りの一言追加)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
  console.log("COMMITTED");
}
main();

/**
 * #454 d686aaf2 の一文の追加（しおりえ(制作補助2)、法務の指摘 9/30 17:33）
 *   出雲日御碕灯台: まわりは断崖で遊歩道が崖ぞいに続くので「灯台のまわりは断崖なので、柵の外に出たり崖に近づいたりしないようにしましょう。」を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-454b-d686aaf2.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "d686aaf2-9cd1-4c2a-a27f-87e042f9d717";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "出雲日御碕灯台" });
  const from = "階段や展望台では足元に気をつけましょう。";
  const to = "階段や展望台では足元に気をつけましょう。灯台のまわりは断崖なので、柵の外に出たり崖に近づいたりしないようにしましょう。";
  if (!(spot.memo ?? "").includes(from)) throw new Error("本文が想定と違います");
  const memo = (spot.memo ?? "").replace(from, to);
  console.log(`灯台: …${memo.slice(-70)}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: spot.id }, { memo });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

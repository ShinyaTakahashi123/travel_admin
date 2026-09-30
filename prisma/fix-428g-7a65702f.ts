/**
 * #428 7a65702f の一文の追加（しおりえ(制作補助2)、法務の提案 9/30 18:11）
 *   湯田温泉: 入浴の一文をほかのしおりとそろえて「長湯を避けて、こまめに水分をとりましょう。」を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-428g-7a65702f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "7a65702f-5c0b-4b5b-a3b7-922d2f9ed73e";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "湯田温泉" });
  const from = "浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。";
  if (!(spot.memo ?? "").includes(from) || (spot.memo ?? "").includes("長湯を避けて")) throw new Error("本文が想定と違います");
  const memo = (spot.memo ?? "").replace(from, from + "長湯を避けて、こまめに水分をとりましょう。");
  console.log(`湯田温泉: …${memo.slice(-80)}`);
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

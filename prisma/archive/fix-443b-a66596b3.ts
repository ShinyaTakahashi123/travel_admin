/**
 * #443 a66596b3 の追いの修正（しおりえ(制作補助2)、法務の指摘）: 仁右衛門島は今も平野家が暮らす島なので、住まいへの配慮の一文を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-443b-a66596b3.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "a66596b3-acab-4036-9ba8-f2d1e8ca2618";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "仁右衛門島" });
  const from = "舟の乗り降りや島の岩場では、足元に気をつけましょう。";
  if (!s.memo?.includes(from)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(from, "今も人が暮らす島なので、決められた見学の道から外れず、静かに見学しましょう。" + from);
  console.log(memo.slice(-110));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

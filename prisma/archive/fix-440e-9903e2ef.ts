/**
 * #440 9903e2ef の追いの修正（しおりえ(制作補助2)、法務の参考の指摘）: 車の旅なので、最後の帰りの一言にレンタカーを返すことを入れる
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-440e-9903e2ef.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "9903e2ef-b144-43b3-885f-c552bc7cc906";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "軽井沢安東美術館" });
  const from = "帰りは、すぐ近くの軽井沢駅から。";
  if (!s.memo?.includes(from)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(from, "帰りは、レンタカーを返して、すぐ近くの軽井沢駅から。");
  console.log(memo.slice(-60));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: s.id }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

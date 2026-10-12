/**
 * #397 f839b893 の追いの修正（しおりえ(制作補助2)、監査の「言い切り?」への対応）
 * - 渦の道: 「世界三大潮流に数えられる海峡で」→「世界三大潮流の一つともいわれる海峡で」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-397b-f839b893.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "f839b893-522c-4fa9-b6d0-8a32a7c0dbf5";
const COMMIT = process.argv.includes("--commit");
const OLD = "鳴門海峡は世界三大潮流に数えられる海峡で、";
const NEW = "鳴門海峡は世界三大潮流の一つともいわれる海峡で、";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "渦の道（大鳴門橋遊歩道）" });
  if (!s.memo?.includes(OLD)) throw new Error("本文が想定と違います");
  console.log(NEW);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { memo: s.memo.replace(OLD, NEW) });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

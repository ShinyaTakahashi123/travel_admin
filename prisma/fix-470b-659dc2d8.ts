/**
 * #470 659dc2d8 の追いの直し（しおりえ(制作補助2)、itinerary-audit の「徒歩が速すぎ 0.6km/5分」）
 *   内宮 → おはらい町・おかげ横丁の歩きを10分にし、おはらい町を 12:25〜13:25（60分）に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-470b-659dc2d8.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "659dc2d8-336e-4031-9439-ba48d93e9e08";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "おはらい町・おかげ横丁" });
  console.log(`おはらい町: 歩き10分・12:25〜13:25（${spot.id}）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: spot.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 25)), stayDurationMin: 60, transitDurationMin: 10 }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

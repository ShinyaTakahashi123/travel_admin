/**
 * #411 2afa2584 の追いの修正（しおりえ(制作補助2)、企画運営の指摘）
 * - 2日目: あしかがフラワーパーク（昼食）を180分→150分、栗田美術館を120分→90分に（13:50〜15:20）。2日目は帰る日なので15時台に終える
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-411b-2afa2584.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "2afa2584-ca85-4263-984e-82ae6f1d282c";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const fp = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "あしかがフラワーパーク（昼食）" });
  const ku = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "栗田美術館" });
  if (fp.stayDurationMin !== 180 || ku.stayDurationMin !== 120) throw new Error("滞在時間が想定と違います");
  console.log("フラワーパーク 11:10〜13:40（150分）／栗田美術館 13:50〜15:20（90分）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: fp.id }, { stayDurationMin: 150 }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: ku.id }, { stayDurationMin: 90, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 50)) }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

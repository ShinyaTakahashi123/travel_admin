/**
 * #435 8e7d688e の追いの修正（しおりえ(制作補助2)、監査の「言い切り」）: 露天風呂の「伊香保で唯一『黄金の湯』の飲泉を体験できる」を「伊香保で唯一とされる、『黄金の湯』の飲泉を体験できる」に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-435b-8e7d688e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "8e7d688e-1378-4f2e-a324-47bbc747576c";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "伊香保露天風呂" });
  const from = "伊香保で唯一「黄金の湯」の飲泉を体験できる飲泉所もあります。";
  if (!s.memo?.includes(from)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(from, "伊香保で唯一とされる、「黄金の湯」の飲泉を体験できる飲泉所もあります。");
  console.log(memo.slice(0, 120));
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

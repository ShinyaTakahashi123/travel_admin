/**
 * #478 c27fe728 の追いの修正（しおりえ(制作補助2)、法務の指摘）
 * - 南極観測船「宗谷」: 「日本で初めての南極観測船」を #418 と同じく「…として知られ」とぼかす
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-478b-c27fe728.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "c27fe728-37c2-4ca0-9bac-06451d485ff2";
const COMMIT = process.argv.includes("--commit");
const OLD = "太平洋戦争を経験したあと、1956年から1962年まで日本で初めての南極観測船として6回の南極観測に活躍しました。";
const NEW = "太平洋戦争を経験したあと、日本で初めての南極観測船として知られ、1956年から1962年まで6回の南極観測に活躍しました。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "南極観測船「宗谷」" });
  if (!s.memo?.includes(OLD)) throw new Error("本文が想定と違います");
  console.log(s.memo.replace(OLD, NEW));
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

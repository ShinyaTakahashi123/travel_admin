/**
 * #431 83518f0d の追いの修正2（しおりえ(制作補助2)、法務の指摘）: 北海道遺産は「指定」ではなく「選定」なので、「北海道遺産に指定されています」→「北海道遺産に選ばれています」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-431c-83518f0d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "83518f0d-2bb9-44db-a3f1-bf8193c73dcf";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "サッポロビール博物館" });
  const from = "北海道遺産に指定されています。";
  if (!s.memo?.includes(from)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(from, "北海道遺産に選ばれています。");
  console.log(memo);
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

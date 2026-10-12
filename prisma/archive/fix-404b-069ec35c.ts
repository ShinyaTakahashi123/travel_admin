/**
 * #404 069ec35c の追いの修正（しおりえ(制作補助2)、prayer-check への対応）
 * - お宮横丁: 「やきそば神社」にも配慮の一文を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-404b-069ec35c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "069ec35c-7f89-4a5f-b487-6c3fa4aef8bc";
const COMMIT = process.argv.includes("--commit");
const OLD = "「やきそば神社」もあります。";
const NEW = "「やきそば神社」もあります。お参りするときは、静かに、敬意をもって手を合わせましょう。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "お宮横丁（昼食）" });
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

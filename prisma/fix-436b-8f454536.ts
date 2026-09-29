/**
 * #436 8f454536 の追いの修正（しおりえ(制作補助2)、法務の指摘）: 1996年はまだ環境庁だったので、時の鐘の「環境省の」を「環境庁（今の環境省）の」に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-436b-8f454536.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "8f454536-d072-4d3f-a7ef-08cf1c127f59";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "時の鐘" });
  const from = "平成8年（1996年）に環境省の";
  if (!s.memo?.includes(from)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(from, "平成8年（1996年）に環境庁（今の環境省）の");
  console.log(memo.slice(-80));
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

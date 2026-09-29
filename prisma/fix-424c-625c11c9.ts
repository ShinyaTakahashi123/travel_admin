/**
 * #424 625c11c9 の追いの修正2（しおりえ(制作補助2)）: 伏見稲荷大社の本文の「藤森神社から歩いて約15分」を、所要時間（25分）に合わせて「約25分」に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-424c-625c11c9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "625c11c9-1f5c-40dd-b510-9e93c517f6ff";
const INARI = "96557949-9dda-4a6f-bee6-ede82ab740f0";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: INARI }, select: { memo: true } });
  const from = "藤森神社から歩いて約15分。";
  if (!s.memo?.startsWith(from)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(from, "藤森神社から歩いて約25分。");
  console.log(memo.slice(0, 60));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: INARI }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

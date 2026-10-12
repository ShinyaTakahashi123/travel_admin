/**
 * #426 6e5b2d45 の追いの修正（しおりえ(制作補助2)、監査の「言い切り」）: 亀山ダムの「千葉県で最初の、そして最大の多目的ダム」を「〜とされます」に。説明文の「千葉県最大の」も「千葉県最大とされる」に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-426b-6e5b2d45.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "6e5b2d45-92e1-4cfe-913d-b80babce8573";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  const spot = await prisma.spot.findFirstOrThrow({ where: { name: "亀山湖", day: { itineraryId: ITINERARY_ID } }, select: { id: true, memo: true } });
  const d0 = "千葉県最大の多目的ダムの湖・亀山湖";
  const m0 = "千葉県で最初の、そして最大の多目的ダムです。";
  if (!it.description?.includes(d0) || !spot.memo?.includes(m0)) throw new Error("本文が想定と違います");
  const description = it.description.replace(d0, "千葉県最大とされる多目的ダムの湖・亀山湖");
  const memo = spot.memo.replace(m0, "千葉県で最初の、そして最大の多目的ダムとされます。");
  console.log(description + "\n" + memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: spot.id }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #424 625c11c9 の追いの修正3（しおりえ(制作補助2)、法務の指摘）: 宇治橋の「日本三古橋の一つに数えられる橋です」を「…の一つともいわれる橋です」に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-424d-625c11c9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "625c11c9-1f5c-40dd-b510-9e93c517f6ff";
const UJIBASHI = "d37e86df-e4bc-4ae6-9c3a-a3f677016784";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: UJIBASHI }, select: { memo: true } });
  const from = "瀬田唐橋・山崎橋とともに日本三古橋の一つに数えられる橋です。";
  if (!s.memo?.includes(from)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(from, "瀬田唐橋・山崎橋とともに日本三古橋の一つともいわれる橋です。");
  console.log(memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 3, spotId: UJIBASHI }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

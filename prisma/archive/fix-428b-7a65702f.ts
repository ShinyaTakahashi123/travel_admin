/**
 * #428 7a65702f の追いの修正（しおりえ(制作補助2)、監査の「言い切り」）: 五重塔の「日本三名塔の一つに数えられ」を「日本三名塔の一つともいわれ」に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-428b-7a65702f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "7a65702f-5c0b-4b5b-a3b7-922d2f9ed73e";
const PAGODA = "6a6c4a6e-46b5-4c24-b9c0-61bd649701bb";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: PAGODA }, select: { memo: true } });
  const from = "日本三名塔の一つに数えられ、";
  if (!s.memo?.includes(from)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(from, "日本三名塔の一つともいわれ、");
  console.log(memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: PAGODA }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

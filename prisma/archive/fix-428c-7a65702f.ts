/**
 * #428 7a65702f の追いの修正2（しおりえ(制作補助2)、法務の指摘）: 湯田温泉に入浴の一文「浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。」を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-428c-7a65702f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "7a65702f-5c0b-4b5b-a3b7-922d2f9ed73e";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findFirstOrThrow({ where: { name: "湯田温泉", day: { itineraryId: ITINERARY_ID } }, select: { id: true, memo: true } });
  const from = "温泉街を歩いたら、宿でゆっくり温まりましょう。";
  if (!s.memo?.includes(from)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(from, from + "浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。");
  console.log(memo);
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

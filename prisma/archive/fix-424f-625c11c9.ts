/**
 * #424 625c11c9 の追いの修正（しおりえ(制作補助2)、法務の指摘）: 恵心院の本文で、自死にふれる言い方（宇治川に身を投げた）を避ける
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-424f-625c11c9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "625c11c9-1f5c-40dd-b510-9e93c517f6ff";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 3, spotName: "恵心院" });
  const from = "『源氏物語』宇治十帖で、宇治川に身を投げた浮舟を助ける横川の僧都のモデルといわれる";
  if (!s.memo?.includes(from)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(from, "『源氏物語』宇治十帖で、倒れていた浮舟を助ける横川の僧都のモデルといわれる");
  console.log(memo.slice(0, 120));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 3, spotId: s.id }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

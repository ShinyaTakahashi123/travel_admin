/**
 * #441 9c2310be の追いの修正（しおりえ(制作補助2)、法務の指摘）: 笠山の火口へ降りる道に、足元の一文を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-441d-9c2310be.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "9c2310be-66b4-4b74-a67f-481c454404a5";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "笠山" });
  const from = "遊歩道で火口の底まで降りることができます。";
  if (!s.memo?.includes(from)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(from, from + "火口への道は段差があるので、足元に気をつけましょう。");
  console.log(memo.slice(80, 220));
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

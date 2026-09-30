/**
 * #441 9c2310be の追いの修正（しおりえ(制作補助2)、企画運営の指摘）: 1日目は歩き、2日目は車なので、2日目の最初に車の旅に変わることを書く
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-441c-9c2310be.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "9c2310be-66b4-4b74-a67f-481c454404a5";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "萩反射炉" });
  const from = "2日目は車で萩の東へ。";
  if (!s.memo?.includes(from)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(from, "2日目は車（レンタカーなど）で、萩の東の笠山のほうへめぐりましょう。");
  console.log(memo.slice(0, 120));
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

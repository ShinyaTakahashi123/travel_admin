/**
 * #479 d5476601 の追いの直し（しおりえ(制作補助2)、法務の指摘 9/30 20:55）: クアージュゆふいんの「温泉療法」は効き目をうたう言い方に近いので言いかえる
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-479c-d5476601.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "d5476601-4ed3-4351-a2a5-8025e4211b26";
const COMMIT = process.argv.includes("--commit");
const FROM = "ドイツ式の温泉療法を体験できるクアハウスで、";
const TO = "ドイツのクアハウスにならった温泉施設で、";

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "クアージュゆふいん" });
  if (!(spot.memo ?? "").includes(FROM)) throw new Error("本文が想定と違います");
  const memo = (spot.memo ?? "").replace(FROM, TO);
  console.log(memo.slice(0, 90));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
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

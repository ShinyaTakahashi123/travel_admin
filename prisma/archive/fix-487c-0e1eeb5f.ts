/**
 * #487 0e1eeb5f の追いの直し（しおりえ(制作補助2)、企画運営 9/30 22:17 の指摘）
 *   丸岡城: 「令和9年秋ごろまで」は先の年の予定なので外す（決まり9）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-487c-0e1eeb5f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "0e1eeb5f-0d86-43b1-9bf5-585210b3c15f";
const COMMIT = process.argv.includes("--commit");
const FROM = "天守は大規模な修理のため、令和9年秋ごろまで足場や幕に覆われる期間があり、";
const TO = "天守は大規模な修理中で、足場や幕に覆われる期間があり、";

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "丸岡城" });
  if (!(spot.memo ?? "").includes(FROM)) throw new Error("本文が想定と違います");
  const memo = (spot.memo ?? "").replace(FROM, TO);
  console.log(memo.slice(-120));
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

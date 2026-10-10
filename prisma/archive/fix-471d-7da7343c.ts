/**
 * #471 7da7343c の追いの直し（しおりえ(制作補助2)、企画運営の指摘 9/30 19:53）
 *   万九千神社: 出雲大社前駅から大津町駅へは川跡駅で北松江線（電鉄出雲市行き）に乗りかえが要るので、それを書く（移動70分はそのまま）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-471d-7da7343c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "7da7343c-0d38-4c30-8818-42ba7d184d2b";
const COMMIT = process.argv.includes("--commit");
const FROM = "稲佐の浜から出雲大社前駅まで歩き、一畑電車で大津町駅へ。";
const TO = "稲佐の浜から出雲大社前駅まで歩き、一畑電車に乗って、川跡駅で北松江線（電鉄出雲市行き）に乗りかえ、大津町駅へ。";

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "万九千神社・立虫神社" });
  if (!(spot.memo ?? "").includes(FROM)) throw new Error("本文が想定と違います");
  const memo = (spot.memo ?? "").replace(FROM, TO);
  console.log(memo.slice(0, 120));
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

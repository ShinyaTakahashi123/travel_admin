/**
 * #476 a37b8c79 の追いの直し（しおりえ(制作補助2)、法務の指摘 9/30 20:40）: 春日大社に鹿の一文を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-476b-a37b8c79.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "a37b8c79-85e0-4c3d-b2c6-94057033f31a";
const COMMIT = process.argv.includes("--commit");
const DEER = "鹿は野生の動物です。近づきすぎたり、からかったりせず、角や足に気をつけましょう。";

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "春日大社" });
  const FROM = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
  if (!(spot.memo ?? "").endsWith(FROM)) throw new Error("本文が想定と違います");
  const memo = (spot.memo ?? "").slice(0, -FROM.length) + DEER + FROM;
  console.log(`…${memo.slice(-90)}`);
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

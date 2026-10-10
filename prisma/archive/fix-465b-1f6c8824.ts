/**
 * #465 1f6c8824 の追いの直し（しおりえ(制作補助2)、法務の指摘 9/30 19:00）: 根津神社の楼門「唯一」を言い切らない形に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-465b-1f6c8824.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "1f6c8824-808f-40bf-aa0e-eb4835ce78ce";
const COMMIT = process.argv.includes("--commit");
const FROM = "楼門は、江戸の神社の楼門で唯一残っているものです。";
const TO = "楼門は、江戸の神社の楼門で唯一残っているものとされます。";

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "根津神社" });
  if (!(spot.memo ?? "").includes(FROM)) throw new Error("本文が想定と違います");
  const memo = (spot.memo ?? "").replace(FROM, TO);
  console.log(`根津神社: …${TO}`);
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

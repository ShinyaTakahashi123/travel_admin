/**
 * #469 6321bfec の追いの直し（しおりえ(制作補助2)、法務の指摘 9/30 19:34）: 箱根湯本温泉の「いちばん古い歴史を持ち」を言い切らない形に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-469b-6321bfec.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "6321bfec-5cd0-49d0-9442-6001d80afe1b";
const COMMIT = process.argv.includes("--commit");
const FROM = "箱根十七湯の中でいちばん古い歴史を持ち、";
const TO = "箱根十七湯の中でいちばん古い歴史を持つとされ、";

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "箱根湯本温泉" });
  if (!(spot.memo ?? "").includes(FROM)) throw new Error("本文が想定と違います");
  const memo = (spot.memo ?? "").replace(FROM, TO);
  console.log(`箱根湯本温泉: …${TO}`);
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

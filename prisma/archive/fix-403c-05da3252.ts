/**
 * #403 05da3252 の追いの修正その2（しおりえ(制作補助2)）
 * - 歩きにすると車が三段壁に残るので、千畳敷へは車で約5分に戻し、三段壁の滞在を55分に（到着10:00は変えない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-403c-05da3252.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "05da3252-800c-4e58-ac4c-0dd2bdcd1369";
const COMMIT = process.argv.includes("--commit");
const OLD = "三段壁から北へ、海沿いを歩いて約15分の海岸です。";
const NEW = "三段壁から車で約5分、北へ少し戻った海岸です。";

async function main() {
  const san = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "三段壁" });
  const sen = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "千畳敷" });
  if (!sen.memo?.includes(OLD)) throw new Error("本文が想定と違います");
  console.log(NEW);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: san.id }, { stayDurationMin: 55 }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: sen.id }, { transitMode: "car", transitDurationMin: 5, memo: sen.memo!.replace(OLD, NEW) }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

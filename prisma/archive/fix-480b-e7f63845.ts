/**
 * #480 e7f63845 の追いの直し（しおりえ(制作補助2)、itinerary-audit の指摘）
 *   起雲閣: 「熱海の三大別荘」とたたえられた → 言い切らない形に
 *   親水公園: 起雲閣から0.4kmなので歩き5分にし、14:30〜15:10（40分）に（熱海城の時刻は変えない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-480b-e7f63845.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "e7f63845-d62e-4ada-9896-22f9fb1d408f";
const COMMIT = process.argv.includes("--commit");
const FROM = "「熱海の三大別荘」とたたえられた邸宅で、";
const TO = "「熱海の三大別荘」のひとつとたたえられたといわれる邸宅で、";

async function main() {
  const kiun = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "起雲閣" });
  const park = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "親水公園・ムーンテラス" });
  if (!(kiun.memo ?? "").includes(FROM)) throw new Error("本文が想定と違います");
  const memo = (kiun.memo ?? "").replace(FROM, TO);
  console.log(memo.slice(0, 80));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: kiun.id }, { memo }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: park.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 30)), stayDurationMin: 40, transitDurationMin: 5 }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

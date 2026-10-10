/**
 * #480 e7f63845 の追いの直し（しおりえ(制作補助2)、企画運営 9/30 21:07・法務 9/30 21:02 の指摘）
 *   タイトル: 「パワースポット」を外し、「來宮神社の大楠とMOA美術館、起雲閣と熱海城をめぐる日帰りプラン」に（企画運営の案）
 *   熱海駅前商店街: 「創業60年、70年という老舗もある小さな店が集まり、」はお店の紹介に近いので外す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-480c-e7f63845.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "e7f63845-d62e-4ada-9896-22f9fb1d408f";
const COMMIT = process.argv.includes("--commit");
const TITLE = "來宮神社の大楠とMOA美術館、起雲閣と熱海城をめぐる日帰りプラン";
const FROM = "創業60年、70年という老舗もある小さな店が集まり、干物や温泉まんじゅう、海鮮丼などが並びます。";
const TO = "干物や温泉まんじゅう、海鮮丼などの店が並びます。";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true } });
  if (!it.title.includes("パワースポット")) throw new Error("タイトルが想定と違います");
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "熱海駅前商店街" });
  if (!(spot.memo ?? "").includes(FROM)) throw new Error("本文が想定と違います");
  const memo = (spot.memo ?? "").replace(FROM, TO);
  console.log(`タイトル: ${TITLE}\n${memo}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE } });
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

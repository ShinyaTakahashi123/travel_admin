/**
 * #472 87ae6a23 の追いの直し（しおりえ(制作補助2)）: 美術館の書き出しに、アスパムから青森駅前のバス乗り場まで歩くことを書く
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-472b-87ae6a23.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "87ae6a23-3462-45da-b81d-577f5869957b";
const COMMIT = process.argv.includes("--commit");
const FROM = "青森駅前から青森市営バスの三内丸山遺跡行きに乗り、";
const TO = "アスパムから青森駅前のバス乗り場まで歩いて、青森市営バスの三内丸山遺跡行きに乗り、";

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "青森県立美術館" });
  if (!(spot.memo ?? "").startsWith(FROM)) throw new Error("本文が想定と違います");
  const memo = (spot.memo ?? "").replace(FROM, TO);
  console.log(memo.slice(0, 80));
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

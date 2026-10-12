/**
 * #431 83518f0d の追いの修正（しおりえ(制作補助2)）: ビール博物館の本文で「見学のあとは」が2回続くので、2つめを外す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-431f-83518f0d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "83518f0d-2bb9-44db-a3f1-bf8193c73dcf";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "サッポロビール博物館" });
  const from = "お酒は20歳から。見学のあとは、このあたりで昼食にしましょう。";
  if (!s.memo?.includes(from)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(from, "お酒は20歳から。このあたりで昼食にしましょう。");
  console.log(memo.slice(-80));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: s.id }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

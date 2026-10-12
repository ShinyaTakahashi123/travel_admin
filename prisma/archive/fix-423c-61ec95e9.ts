/**
 * #423 61ec95e9 の追いの修正（しおりえ(制作補助2)、企画運営の6つの確認の4）: 2日目は歩いてから車に乗るので、どこの車に乗るかを羅漢寺の書き出しに書く
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-423c-61ec95e9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "61ec95e9-752c-4fff-a7d4-b5b0f251159b";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "羅漢寺" });
  const from = "中津城から車で、耶馬渓の羅漢寺へ。";
  if (!s.memo?.includes(from)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(from, "中津城を見たら、宿に置いていた車に乗り、耶馬渓の羅漢寺へ（車で約25分）。");
  console.log(memo.slice(0, 120));
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

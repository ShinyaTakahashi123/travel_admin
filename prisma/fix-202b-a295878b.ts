/**
 * #202 a295878b の追いの直し（しおりえ(制作補助2)、2026-10-01 自分の確かめ: flow-check）
 * - 瀧谷寺の書き出しを、前のスポット（旧岸名家）に合わせる
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-202b-a295878b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "a295878b-e036-44bb-a0a9-a44e5e4a8c0b";
const COMMIT = process.argv.includes("--commit");
const O = "三国湊から車で約10分。";
const N = "旧岸名家から車で約10分。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "瀧谷寺" });
  if (!s.memo?.startsWith(O)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(O, N);
  console.log(memo.slice(0, 60));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { memo });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

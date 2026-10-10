/**
 * #208 b012b648 東平安名崎の書き出しの言い方（しおりえ(制作補助2)、2026-10-01 itinerary-audit「言い切り?」）
 * - 「島の最も東の岬へ」→「宮古島の東の端の岬へ」（宮古島観光協会の「宮古島の最東端」に合わせつつ、最上級の言い方を避ける）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-208b-b012b648.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "b012b648-e622-47c7-b873-11bd4b1d200e";
const COMMIT = process.argv.includes("--commit");
const O = "島の最も東の岬へ。";
const N = "宮古島の東の端の岬へ。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "東平安名崎" });
  if (!s.memo?.includes(O)) throw new Error("本文が想定と違います");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { memo: s.memo.replace(O, N) });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

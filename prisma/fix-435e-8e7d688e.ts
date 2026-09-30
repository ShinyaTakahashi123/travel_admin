/**
 * #435 8e7d688e の言い回しの直し（しおりえ(制作補助2)、法務の指摘: 「ハワイ州がまだ独立国だった時代」は言い方がねじれている）
 *   ハワイ王国公使別邸の本文を「ハワイがまだ独立した王国だった時代」に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-435e-8e7d688e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "8e7d688e-1378-4f2e-a324-47bbc747576c";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "ハワイ王国公使別邸" });
  const from = "ハワイ州がまだ独立国だった時代に", to = "ハワイがまだ独立した王国だった時代に";
  if (!(spot.memo ?? "").includes(from)) throw new Error("本文が想定と違います");
  const memo = (spot.memo ?? "").replace(from, to);
  console.log(`ハワイ王国公使別邸: ${memo.slice(0, 80)}…`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: spot.id }, { memo });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

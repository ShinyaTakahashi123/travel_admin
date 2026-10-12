/**
 * #407 0df57d67 の追いの修正（しおりえ(制作補助2)、監査の「徒歩が速すぎ 1.2km/5分」）: 耶馬溪ダム（湖の点）から溪石園（ダムの堤の下）までは車で5分に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-407e-0df57d67.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "0df57d67-3dc2-4af0-8b22-74933cfcc298";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "耶馬渓ダム記念公園「溪石園」" });
  const from = "ダムのふもとにある耶馬渓ダム記念公園「溪石園」へ。";
  if (!s.memo?.includes(from)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(from, "車でダムのふもとへ下り、耶馬渓ダム記念公園「溪石園」へ。");
  console.log(memo.slice(0, 50));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { memo, transitMode: "car", transitDurationMin: 5 }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

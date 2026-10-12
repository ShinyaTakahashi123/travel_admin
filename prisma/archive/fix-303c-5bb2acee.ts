/**
 * チェックリスト #303 の修正記録(prayer-check.cjsで発見)。
 * しおり「清水寺と八坂神社、東福寺と伏見稲荷大社をめぐり御朱印をいただく
 * 京都1泊2日」(5bb2acee-21b8-4703-97e7-8ba1d3d4988c)
 *
 * 高台寺・東寺に配慮の一文がなかったため追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-303c-5bb2acee.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "5bb2acee-21b8-4703-97e7-8ba1d3d4988c";
const courtesy = "今も信仰が続く場所ですので、静かに、敬意をもって見学しましょう。";

async function main() {
  for (const name of ["高台寺", "東寺"]) {
    const spot = await prisma.spot.findFirstOrThrow({ where: { day: { itineraryId: ITIN_ID }, name } });
    if (spot.memo && !spot.memo.includes(courtesy) && !spot.memo.includes("敬意をもって")) {
      await updateSpotInItinerary(ITIN_ID, { spotId: spot.id }, { memo: `${spot.memo} ${courtesy}` });
    }
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

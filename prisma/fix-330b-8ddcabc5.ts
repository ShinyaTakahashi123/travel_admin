/**
 * #330の続き。自己チェック(tonecheck330.cjs)で天岩戸神社(西本宮)の書き出しに
 * 禁止語「ご案内」が残っていたのを発見・修正。
 * (「…ここではレンタカーでの移動を前提にご案内します。」→
 *  「…ここからはレンタカーでの移動を前提に組み立てています。」)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-330b-8ddcabc5.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "8ddcabc5-91a8-49bb-881a-d60a4d29dc93";

async function main() {
  const spot = await prisma.spot.findFirstOrThrow({ where: { name: "天岩戸神社(西本宮)", day: { itineraryId: ITIN_ID } } });
  const old = "高千穂エリアは路線バスの本数が少ないため、ここではレンタカーでの移動を前提にご案内します。";
  const next = "高千穂エリアは路線バスの本数が少ないため、ここからはレンタカーでの移動を前提に組み立てています。";
  if (spot.memo?.includes(next)) {
    console.log("already applied, skipping");
    return;
  }
  if (!spot.memo?.includes(old)) {
    throw new Error("expected text not found");
  }
  await updateSpotInItinerary(ITIN_ID, { spotId: spot.id }, { memo: spot.memo.replace(old, next) });
  console.log("updated");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #354の続き。企画運営の指摘: fix-354jでの置換が不完全で、奥武山公園の本文に
 * 「沖縄に沖縄の産業の発展に尽くしたとして」と「沖縄」が重複していた。
 * 「沖縄の産業の発展に尽くしたとして」に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-354l-b9b5d943.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b9b5d943-e02a-4013-95e8-89ca62f50842";

async function main() {
  const spot = await prisma.spot.findFirstOrThrow({ where: { name: "奥武山公園", day: { itineraryId: ITIN_ID } } });
  const old = "沖縄に沖縄の産業の発展に尽くしたとして";
  const next = "沖縄の産業の発展に尽くしたとして";
  if (!spot.memo?.includes(old)) {
    console.log("already applied, skipping");
    return;
  }
  await updateSpotInItinerary(ITIN_ID, { spotId: spot.id }, { memo: spot.memo.replace(old, next) });
  console.log("奥武山公園: 重複した「沖縄に」を削除");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #352の続き。flow-checkで「帰りの一言なし」を検出。最後の安良波公園・
 * アラハビーチのメモに、那覇空港への帰り方の一言を追加(決まり3)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-352b-b81511f9.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b81511f9-78dc-4833-99a4-ab6ed8662c71";

async function main() {
  const araha = await prisma.spot.findFirstOrThrow({ where: { name: "安良波公園・アラハビーチ", day: { itineraryId: ITIN_ID } } });

  const old = "北谷ならではの異国情緒とサンセットを、ゆっくり楽しみましょう。";
  const next = "北谷ならではの異国情緒とサンセットを、ゆっくり楽しみましょう。那覇空港へは、車でおよそ30分です。";

  if (!araha.memo?.includes(old)) {
    if (araha.memo?.includes(next)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: araha.id }, { memo: araha.memo.replace(old, next) });
  console.log("安良波公園・アラハビーチ: 帰りの一言を追加");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

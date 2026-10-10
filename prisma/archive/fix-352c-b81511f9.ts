/**
 * #352の続き。fix-352bの「帰りの一言」が、flow-checkの判定キーワード
 * (「帰り」「駅へ」「戻り」「安全運転」等)に一致していなかったため、
 * 「帰りは、那覇空港まで車でおよそ30分です。」に直す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-352c-b81511f9.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b81511f9-78dc-4833-99a4-ab6ed8662c71";

async function main() {
  const araha = await prisma.spot.findFirstOrThrow({ where: { name: "安良波公園・アラハビーチ", day: { itineraryId: ITIN_ID } } });

  const old = "那覇空港へは、車でおよそ30分です。";
  const next = "帰りは、那覇空港まで車でおよそ30分です。";

  if (!araha.memo?.includes(old)) {
    if (araha.memo?.includes(next)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: araha.id }, { memo: araha.memo.replace(old, next) });
  console.log("安良波公園・アラハビーチ: 帰りの一言を判定キーワードに合わせて修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

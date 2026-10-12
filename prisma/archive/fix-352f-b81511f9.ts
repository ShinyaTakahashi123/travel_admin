/**
 * #352の続き。fix-352dの中村家住宅の結びが、flow-checkの「帰りの一言」
 * 判定キーワード(「帰り」「駅へ」「戻り」「安全運転」等)に一致していな
 * かったため、「帰りは、借りたレンタカーで那覇空港まで戻りましょう。」
 * に直す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-352f-b81511f9.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b81511f9-78dc-4833-99a4-ab6ed8662c71";

async function main() {
  const nakamura = await prisma.spot.findFirstOrThrow({ where: { name: "中村家住宅", day: { itineraryId: ITIN_ID } } });

  const old = "見学を終えたら、借りたレンタカーを那覇空港まで返しに行きましょう。";
  const next = "帰りは、借りたレンタカーで那覇空港まで戻りましょう。";

  if (!nakamura.memo?.includes(old)) {
    if (nakamura.memo?.includes(next)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: nakamura.id }, { memo: nakamura.memo.replace(old, next) });
  console.log("中村家住宅: 帰りの一言を判定キーワードに合わせて修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

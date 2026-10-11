/**
 * #364の続き。fix-364cでtransitLegsを3分→5分に直したが、本文の「歩いて3分ほど」の
 * 表記を直し忘れていたため修正する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-364d-cc22e871.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "cc22e871-bc53-4fdd-b777-5a5b47d934a5";

async function main() {
  const horiuchi = await prisma.spot.findFirstOrThrow({ where: { name: "堀内で昼食", day: { itineraryId: ITIN_ID } } });
  const old = "萩城跡から歩いて3分ほど、お昼は堀内地区で食事をとりましょう。";
  const next = "萩城跡から歩いて5分ほど、お昼は堀内地区で食事をとりましょう。";
  if (horiuchi.memo?.includes(old)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: horiuchi.id }, { memo: horiuchi.memo.replace(old, next) });
    console.log("堀内で昼食: 本文の徒歩時間の表記を3分→5分に修正");
  } else {
    console.log("既に対応済み");
  }
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

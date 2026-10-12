/**
 * #355の続き。fix-355dで旧大社駅のmemoを更新し忘れていた(「稲佐の浜から歩いて
 * 向かうのは」のまま残っていた。実際の前のスポットは出雲阿国の墓で、移動手段も
 * 車に変わっている)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-355e-bb5348fc.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "bb5348fc-c7db-472c-82fc-5ddb3db3253b";
const KYUTAISHAEKI_ID = "4eb61bea-41f6-41af-b392-37eb4b77cf47";

async function main() {
  const spot = await prisma.spot.findUniqueOrThrow({ where: { id: KYUTAISHAEKI_ID } });
  const old = "稲佐の浜から歩いて向かうのは旧大社駅です。";
  const next = "出雲阿国の墓から車で向かうのは旧大社駅です。";
  if (!spot.memo?.includes(old)) {
    console.log("already applied, skipping");
    return;
  }
  await updateSpotInItinerary(ITIN_ID, { spotId: KYUTAISHAEKI_ID }, { memo: spot.memo.replace(old, next) });
  console.log("旧大社駅: 書き出しを修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

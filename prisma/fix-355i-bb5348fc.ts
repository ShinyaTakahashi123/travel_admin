/**
 * #355の続き。fix-355hで旧大社駅のvisitTimeが8分早まったのに、出雲日御碕灯台の
 * visitTimeを合わせて直し忘れていた(15:34のまま残り、間24分/移動16分のずれに
 * なっていた)。15:26に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-355i-bb5348fc.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "bb5348fc-c7db-472c-82fc-5ddb3db3253b";

async function main() {
  const toudai = await prisma.spot.findFirstOrThrow({ where: { name: "出雲日御碕灯台", day: { itineraryId: ITIN_ID } } });
  if (toudai.visitTime?.toISOString().slice(11, 16) === "15:26") {
    console.log("already applied, skipping");
    return;
  }
  await updateSpotInItinerary(ITIN_ID, { spotId: toudai.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 15, 26)),
  });
  console.log("出雲日御碕灯台: 開始時刻を15:26に修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

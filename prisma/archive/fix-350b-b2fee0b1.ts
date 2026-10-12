/**
 * #350の続き。fix-350で千秋公園のvisitTimeを明示的に更新し忘れていた
 * (古い11:10のまま残り、時刻の計算が合わない⚠が出た)。伝承館の終了
 * (10:40)+移動15分=10:55に直す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-350b-b2fee0b1.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b2fee0b1-f957-4d81-9338-a35ef506b5e6";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const senshu = await prisma.spot.findFirstOrThrow({ where: { name: "千秋公園", day: { itineraryId: ITIN_ID } } });
  if (senshu.visitTime?.getUTCHours() === 10 && senshu.visitTime?.getUTCMinutes() === 55) {
    console.log("already fixed, skipping");
    return;
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: senshu.id }, { visitTime: t(10, 55) });
  console.log("senshu visitTime fixed to 10:55");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

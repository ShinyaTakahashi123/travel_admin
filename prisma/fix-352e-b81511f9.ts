/**
 * #352の続き。fix-352dで美浜(180→100分)を短縮した際、サンセットビーチ・
 * 安良波公園・アラハビーチのvisitTimeを直し忘れており、itinerary-auditで
 * 時刻の計算の不一致を検出。サンセットビーチ13:05→11:45、安良波14:30→
 * 13:10に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-352e-b81511f9.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b81511f9-78dc-4833-99a4-ab6ed8662c71";

async function main() {
  const sunset = await prisma.spot.findFirstOrThrow({ where: { name: "サンセットビーチ", day: { itineraryId: ITIN_ID } } });
  const araha = await prisma.spot.findFirstOrThrow({ where: { name: "安良波公園・アラハビーチ", day: { itineraryId: ITIN_ID } } });

  if (sunset.visitTime?.getUTCHours() === 11 && sunset.visitTime?.getUTCMinutes() === 45) {
    console.log("already fixed, skipping");
    return;
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: sunset.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 11, 45)) });
  await updateSpotInItinerary(ITIN_ID, { spotId: araha.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 13, 10)) });

  console.log("サンセットビーチ11:45、安良波公園・アラハビーチ13:10に修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

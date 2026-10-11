/**
 * #355の続き。fix-355で出雲大社のvisitTimeを09:00に設定し忘れていた(09:30のまま
 * 残っていた)。09:00に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-355b-bb5348fc.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "bb5348fc-c7db-472c-82fc-5ddb3db3253b";
const IZUMOTAISHA_ID = "25ba1bc6-80c4-469f-9c39-207cb9bdc200";

async function main() {
  const spot = await prisma.spot.findUniqueOrThrow({ where: { id: IZUMOTAISHA_ID } });
  if (spot.visitTime?.toISOString().slice(11, 16) === "09:00") {
    console.log("already applied, skipping");
    return;
  }
  await updateSpotInItinerary(ITIN_ID, { spotId: IZUMOTAISHA_ID }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 9, 0)),
  });
  console.log("出雲大社: 開始時刻を09:00に修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

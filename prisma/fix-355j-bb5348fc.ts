/**
 * #355の続き。fix-355iで灯台のvisitTimeを直した影響で、日御碕神社のvisitTimeも
 * ずれていた(16:36のまま残り、間15分/移動7分のずれになっていた)。16:28に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-355j-bb5348fc.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "bb5348fc-c7db-472c-82fc-5ddb3db3253b";

async function main() {
  const jinja = await prisma.spot.findFirstOrThrow({ where: { name: "日御碕神社", day: { itineraryId: ITIN_ID } } });
  if (jinja.visitTime?.toISOString().slice(11, 16) === "16:28") {
    console.log("already applied, skipping");
    return;
  }
  await updateSpotInItinerary(ITIN_ID, { spotId: jinja.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 16, 28)),
  });
  console.log("日御碕神社: 開始時刻を16:28に修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

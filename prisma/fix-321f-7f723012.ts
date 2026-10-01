/**
 * #321 水沢うどんと石段の湯、伊香保温泉グルメ&湯めぐり1泊2日
 * 企画運営の再調査(10/1)で発覚した、つなぎのずれ修正。
 * 水澤寺の結びが、実際の次(ハワイ王国公使別邸・バス20分)ではなく、
 * その次(徳冨蘆花記念文学館)を指していた(時間の20分は合っていたが行き先名が誤り)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-321f-7f723012.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "7f723012-6fc6-4ba2-9c16-1d38bcf7540e";

async function main() {
  const spot = await prisma.spot.findFirstOrThrow({ where: { name: "水澤寺", day: { itineraryId: ITIN_ID } } });

  const old = "続いては、バスでおよそ20分の徳冨蘆花記念文学館へ向かいましょう。";
  const next = "続いては、バスでおよそ20分のハワイ王国公使別邸へ向かいましょう。";

  if (!spot.memo?.includes(old)) {
    if (spot.memo?.includes(next)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: spot.id }, { memo: spot.memo.replace(old, next) });
  console.log("水澤寺: closer fixed → ハワイ王国公使別邸(バス20分)");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

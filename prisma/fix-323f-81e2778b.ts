/**
 * #323 桜島フェリーと湯之平展望所、活火山・桜島を間近に望むプラン
 * 企画運営の再調査(10/1)で発覚した、つなぎのずれ修正。
 * 溶岩なぎさ公園の結びが、実際の次(烏島展望所・バス25分)ではなく、
 * その次(湯之平展望所)を指していた。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-323f-81e2778b.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "81e2778b-4a9f-4594-93a2-1bde60bae8ca";

async function main() {
  const spot = await prisma.spot.findFirstOrThrow({ where: { name: "溶岩なぎさ公園", day: { itineraryId: ITIN_ID } } });

  const old = "続いては、バスで湯之平展望所へ向かいましょう。";
  const next = "続いては、バスでおよそ25分の烏島展望所へ向かいましょう。";

  if (!spot.memo?.includes(old)) {
    if (spot.memo?.includes(next)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: spot.id }, { memo: spot.memo.replace(old, next) });
  console.log("溶岩なぎさ公園: closer fixed → 烏島展望所(バス25分)");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

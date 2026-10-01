/**
 * #274 阿蘇神社と一の宮門前町、火の国の信仰と参道グルメの1泊2日
 * 企画運営の再調査(10/1)で発覚した、つなぎのずれ修正。
 * 阿蘇火山博物館の結びが、実際の次(米塚・車8分)ではなく、
 * その次(草千里ヶ浜)を指していた(移動手段も「歩いて」のまま誤り)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-274-308f7fac.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "308f7fac-0186-44e2-9eed-1f56ccc593c9";

async function main() {
  const spot = await prisma.spot.findFirstOrThrow({ where: { name: "阿蘇火山博物館", day: { itineraryId: ITIN_ID } } });

  const old = "見学を終えたら、歩いて草千里ヶ浜へ向かいましょう。";
  const next = "見学を終えたら、車でおよそ8分の米塚へ向かいましょう。";

  if (!spot.memo?.includes(old)) {
    if (spot.memo?.includes(next)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: spot.id }, { memo: spot.memo.replace(old, next) });
  console.log("阿蘇火山博物館: closer fixed → 米塚(車8分)");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

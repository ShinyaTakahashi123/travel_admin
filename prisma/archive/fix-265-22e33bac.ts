/**
 * #265 旧門司三井倶楽部と出光美術館、大正ロマン建築をめぐるアート散策
 * 企画運営の再調査(10/1)で発覚した、つなぎのずれ修正。
 * 関門海峡ミュージアムの結びが、実際の次(#7 和布刈神社)ではなく、
 * その2つ先(#9 関門トンネル人道)を指していた。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-265-22e33bac.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "22e33bac-7b3c-4cc1-bd56-d225434ade10";

async function main() {
  const spot = await prisma.spot.findFirstOrThrow({ where: { name: "関門海峡ミュージアム", day: { itineraryId: ITIN_ID } } });

  const old = "見学を終えたら、歩いて関門トンネル人道へ向かいましょう。";
  const next = "見学を終えたら、歩いて和布刈神社へ向かいましょう。";

  if (!spot.memo?.includes(old)) {
    if (spot.memo?.includes(next)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: spot.id }, { memo: spot.memo.replace(old, next) });
  console.log("関門海峡ミュージアム: closer fixed → 和布刈神社");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

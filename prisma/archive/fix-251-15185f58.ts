/**
 * #251 三峯神社の霧海と気運、秩父のパワースポットを巡る1泊2日
 * 企画運営の言葉の点検やり直し(10/1 13:24)で発覚。
 * 秩父まつり会館「毎年12月3日の本祭」→行事の日にちは月までにする決まりのため
 * 「毎年12月の本祭」に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-251-15185f58.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "15185f58-5c6a-441b-a1a0-321b50f7a606";

async function main() {
  const spot = await prisma.spot.findFirstOrThrow({ where: { name: "秩父まつり会館", day: { itineraryId: ITIN_ID } } });

  const old = "毎年12月3日の本祭には、笠鉾・屋台が町を曳き回されます。";
  const next = "毎年12月の本祭には、笠鉾・屋台が町を曳き回されます。";

  if (!spot.memo?.includes(old)) {
    if (spot.memo?.includes(next)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: spot.id }, { memo: spot.memo.replace(old, next) });
  console.log("秩父まつり会館: 日付表記を修正(毎年12月3日→毎年12月)");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

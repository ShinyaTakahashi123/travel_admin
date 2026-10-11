/**
 * #360の続き。法務(記録87d5c81)の指摘に対応。
 * 南京町「『日本三大中華街』の一つに数えられ」は、ヘッジが同じ文の中になく、
 * #222・#226・#228と同じ基準で不十分だったため、「〜の一つとされ」の伝聞に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-360c-bf51abd1.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "bf51abd1-ab87-4ed5-8f1e-4405ff855fa1";

async function main() {
  const nankinmachi = await prisma.spot.findFirstOrThrow({ where: { name: "南京町", day: { itineraryId: ITIN_ID } } });
  const old = "「日本三大中華街」の一つに数えられ、";
  const next = "「日本三大中華街」の一つとされ、";
  if (nankinmachi.memo?.includes(old)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: nankinmachi.id }, { memo: nankinmachi.memo.replace(old, next) });
    console.log("南京町: 「数えられ」を「とされ」の伝聞に修正");
  } else {
    console.log("南京町: 既に対応済み");
  }
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

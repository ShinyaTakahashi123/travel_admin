/**
 * #337の続き。itinerary-audit.cjsの「言い切り?」指摘に対応。
 * 徳川美術館の「現存する最古の物語絵巻として知られ」にヘッジ(とされ)を追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-337b-9d4badcb.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "9d4badcb-ec4d-4eaf-97af-b173d3d4ff5d";

async function main() {
  const s = await prisma.spot.findFirstOrThrow({ where: { name: "徳川美術館", day: { itineraryId: ITIN_ID } } });
  const old = "現存する最古の物語絵巻として知られ、期間限定で公開されています。";
  const next = "現存する最古の物語絵巻とされ、期間限定で公開されています。";
  if (!s.memo?.includes(old)) {
    console.log("already fixed");
    return;
  }
  await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { memo: s.memo.replace(old, next) });
  console.log("fixed");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

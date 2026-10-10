/**
 * #319の続き。法務2026-09-30 22:45の指摘(#477と同じ)。
 * 大宮公園小動物園にふれた大宮公園のメモに、動物への餌やり・柵への
 * 手入れ禁止の安全の一文を追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-319e-7d80c940.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "7d80c940-0507-41af-8688-ccb64b79a0a1";

async function main() {
  const park = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "大宮公園" },
  });
  const old = "身近な距離で様々な動物を観察できます。緑豊かな園内を、";
  const next =
    "身近な距離で様々な動物を観察できます。動物に食べ物をあげたり、さくに手を入れたりしないようにしましょう。緑豊かな園内を、";
  if (park.memo?.includes(old)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: park.id }, { memo: park.memo.replace(old, next) });
  }
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

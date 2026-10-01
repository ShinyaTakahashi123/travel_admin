/**
 * #350の続き。法務13:08の「できれば」の指摘対応。竿燈演技体験に、係の人の
 * 案内に従う旨の一言を追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-350e-b2fee0b1.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b2fee0b1-f957-4d81-9338-a35ef506b5e6";

async function main() {
  const denshokan = await prisma.spot.findFirstOrThrow({ where: { name: "秋田市民俗芸能伝承館", day: { itineraryId: ITIN_ID } } });

  const old = "実物の竿燈を手に持って、平手や額、肩、腰に乗せる「竿燈演技体験」も通年受け付けており、予約なしで気軽に挑戦できます。";
  const next =
    "実物の竿燈を手に持って、平手や額、肩、腰に乗せる「竿燈演技体験」も通年受け付けており、予約なしで気軽に挑戦できます。体験は係の人の案内に従い、まわりの人に気をつけて行いましょう。";

  if (!denshokan.memo?.includes(old)) {
    if (denshokan.memo?.includes(next)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: denshokan.id }, { memo: denshokan.memo.replace(old, next) });
  console.log("denshokan: safety line added");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

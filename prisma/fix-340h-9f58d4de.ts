/**
 * #340の続き。法務10:46の指摘対応(写真の場所違い)。
 * 天開稲荷社・太宰府天満宮参道についていた写真(どちらもWikimedia Commonsの
 * 20100719_Dazaifu_Tenmangu_Shrine_3328.jpg)は、実際には太宰府天満宮の
 * 本殿の写真だった(太宰府天満宮には別の写真が既についている)。
 * 誤った2件を削除し、正しい写真が見つかるまでは写真なしのままにする。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-340h-9f58d4de.ts
 */
import { prisma } from "../src/lib/prisma";

async function main() {
  const photos = await prisma.photo.findMany({
    where: { id: { in: ["64bc7acf-ec1e-4570-8b5f-d5573da8ea2e", "b3cf585d-13e9-436e-94cc-2514fa88e80e"] } },
  });
  if (photos.length === 0) {
    console.log("already removed, skipping");
    return;
  }

  const result = await prisma.photo.deleteMany({
    where: { id: { in: ["64bc7acf-ec1e-4570-8b5f-d5573da8ea2e", "b3cf585d-13e9-436e-94cc-2514fa88e80e"] } },
  });
  console.log(`removed ${result.count} mismatched photo(s) (天開稲荷社・太宰府天満宮参道)`);
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

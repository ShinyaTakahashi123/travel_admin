/**
 * #370の続き。砂楽のPhoto行(ファイル名「開聞岳-指宿」)を開いて確認したところ、
 * 砂むし温泉ではなく開聞岳(海上から見た円錐形の山)の写真だった。スポットの
 * 実際の見た目と合わないため削除し、同じ画像を指していたしおりの
 * thumbnailUrlもnullにする。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-370b-d0407258.ts
 */
import { prisma } from "../src/lib/prisma";

const ITIN_ID = "d0407258-4c18-434a-b83b-606ef8859b6d";
const DAY1_ID = "a602dd91-f920-439a-8ccb-2e187f19a5a2";
const MISMATCHED_URL =
  "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/commons-replacement/%E9%96%8B%E8%81%9E%E5%B2%B3-%E6%8C%87%E5%AE%BF-nbnQIqRbWc0QEojsMxmH7eRIYcnzrv.jpg";

async function main() {
  const itin = await prisma.itinerary.findFirstOrThrow({ where: { id: ITIN_ID } });
  const sunaraku = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "指宿温泉 砂むし会館 砂楽" } });

  const photo = await prisma.photo.findFirst({ where: { spotId: sunaraku.id, url: MISMATCHED_URL } });
  if (!photo) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.photo.delete({ where: { id: photo.id } });
  if (itin.thumbnailUrl === MISMATCHED_URL) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { thumbnailUrl: null } });
  }

  console.log("#370続き: 砂楽の開聞岳の誤った写真を削除、thumbnailUrlもnullにした");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

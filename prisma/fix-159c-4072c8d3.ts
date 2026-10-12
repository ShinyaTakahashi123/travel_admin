/**
 * #159の続き。写真を開いて確認したところ、「金剛峯寺」に付いていた写真
 * (ファイル名は「金剛峯寺」)が、「壇上伽藍」に付いている写真とバイト単位で
 * 完全に同じファイルだった(MD5が一致)。実際の写っている建物は、壇上伽藍
 * にある根本大塔(朱色の多宝塔)で、金剛峯寺(瓦葺きの本坊)とは別の建物。
 * 金剛峯寺の写真として使うのは誤りのため削除する。
 * itineraryのthumbnailUrlも同じ誤った写真を指していたため、正しい
 * 壇上伽藍の写真に差し替える。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-159c-4072c8d3.ts
 */
import { prisma } from "../src/lib/prisma";

const ITIN_ID = "4072c8d3-793a-4c6b-a94a-1e273a9ec2d6";
const DANJOGARAN_PHOTO_URL =
  "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/official-areas-09/%25E5%25A3%2587%25E4%25B8%258A%25E4%25BC%25BD%25E8%2597%258D-XH8Q1lG7EvnTOc7OeQGffgPgYQWdPT.jpg";

async function main() {
  const kongobuji = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "金剛峯寺" },
  });
  const photo = await prisma.photo.findFirst({ where: { spotId: kongobuji.id } });

  if (!photo) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.photo.delete({ where: { id: photo.id } });
  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { thumbnailUrl: DANJOGARAN_PHOTO_URL } });

  console.log("#159続き: 金剛峯寺の誤った写真(実際は壇上伽藍の根本大塔)を削除し、thumbnailUrlを壇上伽藍の写真に差し替え");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

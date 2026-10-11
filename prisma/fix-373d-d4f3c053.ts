/**
 * #373の続き。ネコの細道のPhoto行(ファイル名「尾道市」)を開いて確認したと
 * ころ、猫の細道ではなく、赤い本堂と多宝塔が並ぶ大きな寺院(浄土寺の特徴と
 * 一致)の写真だった。スポットの実際の見た目と合わないため削除する。
 * (itineraryのthumbnailUrlは別の、美術館の正しい写真を指しているため
 * 変更不要)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-373d-d4f3c053.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY2_ID = "d2670dc7-26f6-4415-b272-7d108d5f3a8e";
const MISMATCHED_URL =
  "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/official-areas-19/%25E5%25B0%25BE%25E9%2581%2593%25E5%25B8%2582-HiBiHVnImJwiVUbe2WgKak4RKFdvg4.jpg";

async function main() {
  const nekohodo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "ネコの細道" } });
  const photo = await prisma.photo.findFirst({ where: { spotId: nekohodo.id, url: MISMATCHED_URL } });
  if (!photo) {
    console.log("already applied, skipping");
    return;
  }
  await prisma.photo.delete({ where: { id: photo.id } });
  console.log("#373続き: ネコの細道の誤った写真(浄土寺らしき寺院の写真)を削除した");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

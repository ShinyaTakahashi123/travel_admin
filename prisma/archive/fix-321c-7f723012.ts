/**
 * #321の続き。法務2026-09-30 23:32(表示23:41→訂正23:32)の2点。
 * 1. 水沢うどん街の写真(Mizusawa_Udon_Tamaruya.JPG、元祖田丸屋という1店の
 *    看板が大きく写る)が、店の紹介にあたるうえ表紙にもなっていたため、
 *    Photo行を削除し、表紙(thumbnailUrl)を石段街の写真(matsukaz、撮影者名
 *    あり)に差し替えた。
 * 2. 伊香保グリーン牧場に「動物とふれあうときは、牧場の決まりに従いましょう。」
 *    を追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-321c-7f723012.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "7f723012-6fc6-4ba2-9c16-1d38bcf7540e";

async function main() {
  const udon = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "水沢うどん街" },
  });
  const ishidan = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "石段街" },
    include: { photos: true },
  });

  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const badThumbUrl =
    "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/official-areas-08/%25E6%25B0%25B4%25E6%25B2%25A2%25E3%2581%2586%25E3%2581%25A9%25E3%2582%2593-T53lMDmPeNNhRozys8yTyYMPC19Vth.jpg";
  if (itin.thumbnailUrl === badThumbUrl) {
    const ishidanPhoto = ishidan.photos[0];
    if (!ishidanPhoto) throw new Error("石段街の写真が見つかりません");
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { thumbnailUrl: ishidanPhoto.url } });
  }

  await prisma.photo.deleteMany({
    where: { spotId: udon.id, sourceUrl: "https://commons.wikimedia.org/wiki/File:Mizusawa_Udon_Tamaruya.JPG" },
  });

  const bokujo = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "伊香保グリーン牧場" },
  });
  const old = "旅の締めくくりに、のどかな牧場の風景の中で、動物たちとのひとときを楽しみましょう。";
  const next =
    "旅の締めくくりに、のどかな牧場の風景の中で、動物たちとのひとときを楽しみましょう。動物とふれあうときは、牧場の決まりに従いましょう。";
  if (bokujo.memo?.includes(old)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: bokujo.id }, { memo: bokujo.memo.replace(old, next) });
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

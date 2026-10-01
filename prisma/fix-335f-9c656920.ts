/**
 * #335の続き。制作補助2の気づき(企画運営09:39転送): cover-credit-checkで、
 * 表紙に撮影者名が出ない。海地獄の場所違いの写真(実は血の池地獄の写真)を
 * 削除した際、表紙(thumbnailUrl)がその削除済みファイルを指したまま残り、
 * 出典を追跡できないPhotoレコードなしの状態になっていた。
 * 血の池地獄に今もついている、同じ内容で出典つきの写真のURLに差し替える。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-335f-9c656920.ts
 */
import { prisma } from "../src/lib/prisma";

const ITIN_ID = "9c656920-3b82-425e-915c-1caa49ba9e47";

async function main() {
  const chinoike = await prisma.spot.findFirstOrThrow({ where: { name: "血の池地獄", day: { itineraryId: ITIN_ID } } });
  const photo = await prisma.photo.findFirstOrThrow({ where: { spotId: chinoike.id } });

  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  if (itin.thumbnailUrl === photo.url) {
    console.log("already fixed");
    return;
  }

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { thumbnailUrl: photo.url } });
  console.log("thumbnailUrl updated to credited 血の池地獄 photo:", photo.url);
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

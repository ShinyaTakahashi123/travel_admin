/**
 * #350の続き。法務12:59の指摘対応。秋田市民俗芸能伝承館についていた写真
 * (Akarenga-kan_Museum_in_Akita_20190707a.jpg、実際は赤れんが郷土館の
 * 建物)を、新規追加した秋田市立赤れんが郷土館のスポットに付け替える。
 * 表紙(thumbnailUrl)はURLが変わらないためそのまま。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-350c-b2fee0b1.ts
 */
import { prisma } from "../src/lib/prisma";

const PHOTO_ID = "c7f07a92-9852-48e9-bc8e-498dd51c47c3";
const AKARENGA_SPOT_ID = "10bd2f24-bc87-4d8b-9ac5-d960424f92e8";

async function main() {
  const photo = await prisma.photo.findUniqueOrThrow({ where: { id: PHOTO_ID } });
  if (photo.spotId === AKARENGA_SPOT_ID) {
    console.log("already fixed, skipping");
    return;
  }

  await prisma.photo.update({ where: { id: PHOTO_ID }, data: { spotId: AKARENGA_SPOT_ID, caption: "秋田市立赤れんが郷土館" } });
  console.log("photo reassigned from 伝承館 to 赤れんが郷土館");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * 法務の指摘。add-photo-batch6で22b14d35(児島ジーンズストリート)に付けた写真
 * (Kojima_Jeans_Street_2021-08_ac_(1).jpg)は、店の名前(RIVETS)の大きな看板が
 * 写真の中心の一つになっていたため、看板の写っていない写真に差し替える。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photoadd-20261012-b6-fix";
const FILE_TITLE = "Kojima Jeans Street 2021-08 ac (5).jpg";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '22b14d35%'`);
  const itinId = rows[0].id;
  const itin = await prisma.itinerary.findUnique({ where: { id: itinId }, select: { thumbnailUrl: true } });
  const spot = await prisma.spot.findFirst({ where: { name: "児島ジーンズストリート", day: { itineraryId: itinId } }, include: { photos: true } });
  if (!spot) throw new Error("スポットが見つかりません");
  if (spot.photos.length !== 1) throw new Error("既存の写真が1枚ではありません: " + spot.photos.length);
  const oldPhoto = spot.photos[0];
  if (oldPhoto.sourceUrl !== "https://commons.wikimedia.org/wiki/File:Kojima_Jeans_Street_2021-08_ac_(1).jpg") {
    throw new Error("既存写真の出典が想定外です: " + oldPhoto.sourceUrl);
  }
  console.log("確認OK。差し替え元:", oldPhoto.id, oldPhoto.url, "| 現在の表紙と一致:", itin!.thumbnailUrl === oldPhoto.url);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  const result = await uploadCommonsFile(FILE_TITLE, "児島ジーンズストリート", BLOB_PREFIX);
  if (!result) throw new Error("画像の取得・ライセンス確認に失敗しました");
  console.log("取得:", result.url, result.credit);

  await prisma.photo.delete({ where: { id: oldPhoto.id } });
  const newPhoto = await prisma.photo.create({
    data: {
      spotId: spot.id,
      url: result.url,
      caption: "児島ジーンズストリート",
      sourceUrl: result.credit.sourceUrl ?? null,
      author: result.credit.author ?? null,
      license: result.credit.license ?? null,
      licenseUrl: result.credit.licenseUrl ?? null,
    },
  });

  if (itin!.thumbnailUrl === oldPhoto.url) {
    await prisma.itinerary.update({ where: { id: itinId }, data: { thumbnailUrl: newPhoto.url } });
    console.log("表紙も差し替えました");
  }

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

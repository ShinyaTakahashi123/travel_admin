/**
 * 写真がなくなったしおりの写真探し ラウンド2。法務の指摘:
 * e8cf096c(境港)の「水木しげるロード」に付けた写真(境港本町アーケード商店街2.JPG)は、
 * アーケード入口に酒の銘柄の大きな看板・食堂の看板・手前の人が写っている。
 * 看板・人の目立たない、水木しげるロードの妖怪広場を写した写真に差し替える。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photofill-20261012-r2";
const FILE_TITLE = "Yokai space, Mizuki Shigeru Road.jpg";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'e8cf096c%'`);
  const itinId = rows[0].id;
  const itin = await prisma.itinerary.findUnique({ where: { id: itinId }, select: { thumbnailUrl: true } });
  const spot = await prisma.spot.findFirst({ where: { name: "水木しげるロード", day: { itineraryId: itinId } }, include: { photos: true } });
  if (!spot) throw new Error("スポットが見つかりません");
  if (spot.photos.length !== 1) throw new Error("既存の写真が1枚ではありません: " + spot.photos.length);
  const oldPhoto = spot.photos[0];
  console.log("確認OK。差し替え元の写真:", oldPhoto.id, oldPhoto.url);
  console.log("現在の表紙:", itin!.thumbnailUrl, "一致:", itin!.thumbnailUrl === oldPhoto.url);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  const result = await uploadCommonsFile(FILE_TITLE, "水木しげるロード", BLOB_PREFIX);
  if (!result) throw new Error("画像の取得・ライセンス確認に失敗しました");
  console.log("取得:", result.url, result.credit);

  await prisma.photo.delete({ where: { id: oldPhoto.id } });
  const newPhoto = await prisma.photo.create({
    data: {
      spotId: spot.id,
      url: result.url,
      caption: "水木しげるロード(妖怪広場)",
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

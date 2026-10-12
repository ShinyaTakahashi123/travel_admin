/**
 * 企画運営の指摘。90e7362b(石打丸山・苗場ドラゴンドラ、季節は春・秋)の表紙が、
 * 「ザ・ヴェランダ石打丸山」に付いたFile:Iwappara.jpgで、ファイル名・説明(Iwappara Ski area、
 * カテゴリIwappara Ski Resort)のとおり石打丸山ではなく岩原スキー場(別のスキー場)の写真だった。
 * 撮影日も2004-02-08の雪のゲレンデで、春・秋の季節にも合っていない。
 * 石打丸山自体の、雪のない季節の写真に差し替える。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photofill-20261012-r4";
const FILE_TITLE = "石打丸山スキー場 南魚沼市石打 国道17号から Sep 5, 2024.jpg";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '90e7362b%'`);
  const itinId = rows[0].id;
  const itin = await prisma.itinerary.findUnique({ where: { id: itinId }, select: { thumbnailUrl: true } });
  const spot = await prisma.spot.findFirst({ where: { name: "ザ・ヴェランダ石打丸山", day: { itineraryId: itinId } }, include: { photos: true } });
  if (!spot) throw new Error("スポットが見つかりません");
  if (spot.photos.length !== 1) throw new Error("既存の写真が1枚ではありません: " + spot.photos.length);
  const oldPhoto = spot.photos[0];
  if (oldPhoto.sourceUrl !== "https://commons.wikimedia.org/wiki/File:Iwappara.jpg") throw new Error("既存写真の出典が想定外です: " + oldPhoto.sourceUrl);
  console.log("確認OK。差し替え元:", oldPhoto.id, oldPhoto.url, "| 現在の表紙と一致:", itin!.thumbnailUrl === oldPhoto.url);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  const result = await uploadCommonsFile(FILE_TITLE, "ザ・ヴェランダ石打丸山", BLOB_PREFIX);
  if (!result) throw new Error("画像の取得・ライセンス確認に失敗しました");
  console.log("取得:", result.url, result.credit);

  await prisma.photo.delete({ where: { id: oldPhoto.id } });
  const newPhoto = await prisma.photo.create({
    data: {
      spotId: spot.id,
      url: result.url,
      caption: "石打丸山スキー場",
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

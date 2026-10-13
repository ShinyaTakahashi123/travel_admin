/**
 * #35の直し(自己点検)。表参道(門前商店街)に写真が0枚だったため、Commonsから取得して追加。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "newarea35-yutoku";
const OMOTESANDO_SPOT_ID = "e40054ed-cd45-4b23-85d1-de488c5aa8b6";

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: OMOTESANDO_SPOT_ID }, include: { photos: true } });
  if (!spot) throw new Error("想定と違います");
  if (spot.photos.length > 0) throw new Error("既に写真があります(想定外)");

  const photo = await uploadCommonsFile("Sando of Yutoku Inari Shrine.jpg", "表参道(門前商店街)", BLOB_PREFIX);
  if (!photo) throw new Error("画像の取得・ライセンス確認に失敗しました");
  console.log("取得:", photo.url, photo.credit);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.photo.create({
    data: {
      spotId: OMOTESANDO_SPOT_ID, url: photo.url, caption: "表参道(門前商店街)",
      sourceUrl: photo.credit.sourceUrl ?? null, author: photo.credit.author ?? null,
      license: photo.credit.license ?? null, licenseUrl: photo.credit.licenseUrl ?? null,
    },
  });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

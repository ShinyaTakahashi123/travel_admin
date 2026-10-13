/**
 * #30の直し(自己点検)。鶴ヶ城(スポット)に写真が0枚だったため、Commonsから取得して追加。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "sake30-aizu";
const TSURUGAJO_SPOT_ID = "b8080e0c-e864-4fd7-b987-23991ac43c58";

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: TSURUGAJO_SPOT_ID }, include: { photos: true } });
  if (!spot) throw new Error("想定と違います");
  if (spot.photos.length > 0) throw new Error("既に写真があります(想定外)");

  const photo = await uploadCommonsFile("Aizuwakamatsu Castle 05.jpg", "鶴ヶ城", BLOB_PREFIX);
  if (!photo) throw new Error("画像の取得・ライセンス確認に失敗しました");
  console.log("取得:", photo.url, photo.credit);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.photo.create({
    data: {
      spotId: TSURUGAJO_SPOT_ID, url: photo.url, caption: "鶴ヶ城",
      sourceUrl: photo.credit.sourceUrl ?? null, author: photo.credit.author ?? null,
      license: photo.credit.license ?? null, licenseUrl: photo.credit.licenseUrl ?? null,
    },
  });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

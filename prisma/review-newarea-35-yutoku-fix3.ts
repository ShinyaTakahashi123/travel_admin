/**
 * #35の直し(自己点検)。奥の院に写真が0枚だったため、Commonsから取得して追加。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "newarea35-yutoku";
const OKUNOIN_SPOT_ID = "ee1068f8-ccdf-4f0f-b8dc-d7ed49406698";

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: OKUNOIN_SPOT_ID }, include: { photos: true } });
  if (!spot) throw new Error("想定と違います");
  if (spot.photos.length > 0) throw new Error("既に写真があります(想定外)");

  const photo = await uploadCommonsFile("Okunoin Shrine of Yutoku Inari Shrine.jpg", "奥の院", BLOB_PREFIX);
  if (!photo) throw new Error("画像の取得・ライセンス確認に失敗しました");
  console.log("取得:", photo.url, photo.credit);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.photo.create({
    data: {
      spotId: OKUNOIN_SPOT_ID, url: photo.url, caption: "奥の院",
      sourceUrl: photo.credit.sourceUrl ?? null, author: photo.credit.author ?? null,
      license: photo.credit.license ?? null, licenseUrl: photo.credit.licenseUrl ?? null,
    },
  });
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

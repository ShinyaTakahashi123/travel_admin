/**
 * #24の直し(写真追加)。伊予西条駅前（昼食）に写真がなかったため追加する。
 * 弘法水も写真がなかったが、Commonsで見つかった「Koubousui01.jpg」は中身を
 * 確認したところ漁港の写真で、弘法水とは無関係だったため使わない(見送り)。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "newarea24-saijo";

async function main() {
  const ekimae = await prisma.spot.findFirst({ where: { name: "伊予西条駅前（昼食）" }, include: { photos: true } });
  if (!ekimae) throw new Error("想定と違います");
  if (ekimae.photos.length > 0) throw new Error("既に写真があります(想定外)");

  const photo = await uploadCommonsFile("JR Shikoku Iyo-Saijo Station.jpg", "伊予西条駅前", BLOB_PREFIX);
  if (!photo) throw new Error("画像の取得・ライセンス確認に失敗しました");
  console.log("取得:", photo.url, photo.credit);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.placeMaster.update({
    where: { id: ekimae.placeMasterId! },
    data: {
      photoUrl: photo.url, photoAuthor: photo.credit.author ?? null,
      photoLicense: photo.credit.license ?? null, photoLicenseUrl: photo.credit.licenseUrl ?? null,
      photoSourceUrl: photo.credit.sourceUrl ?? null, verifiedAt: new Date(),
    },
  });
  await prisma.photo.create({
    data: {
      spotId: ekimae.id, url: photo.url, caption: "伊予西条駅前",
      sourceUrl: photo.credit.sourceUrl ?? null, author: photo.credit.author ?? null,
      license: photo.credit.license ?? null, licenseUrl: photo.credit.licenseUrl ?? null,
    },
  });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

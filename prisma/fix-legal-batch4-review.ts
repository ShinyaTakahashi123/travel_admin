/**
 * 法務の台帳バッチ4(301〜400件目)レビュー(2026-10-13 01:23)への対応。
 * 1. 九谷焼窯跡展示館: 館内展示品(水注)のアップで場所の写真でない。Commonsに建物の
 *    代わりの写真が見つからないため、台帳・公式しおり(167d6f24)とも写真なしにする
 *    (表紙ではないため表紙の差し替えは不要)。
 * 2. 熊野本宮大社: 神門の内側の社殿の写真で、本宮大社が内側の撮影を控えるよう求めている。
 *    参拝者も近くに写っている。法務の提案どおり、神門の外の一の鳥居の写真
 *    (Tanabe Kumano Hongu-Taisha Ichi-no-Torii.jpg、CC BY 4.0、人は遠くに小さく写るのみ)に
 *    差し替える。台帳と公式しおり(74506e1f、表紙)の両方を直す。
 * 3. 呼子朝市: 撮影者の表示が「flickr ID; gtknj (URL)」と崩れている。「gtknj」に直す
 *    (台帳と公式しおりd0a83d9fの両方)。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "placemaster-fix-20261013-6";

const KUTANI_PLACE_ID = "6dffb33a-8e01-4951-9c40-558ed3d327f2";
const KUTANI_PHOTO_ID = "a8b7929e-92bb-4c7c-850d-75093ff042bf";

const KUMANO_PLACE_ID = "59e8ce4e-8317-4e4d-83d4-3212fe3cfaab";
const KUMANO_PHOTO_ID = "7438beee-d515-4c35-a365-4e79c49f5e2b";
const KUMANO_ITIN_ID = "74506e1f-41b4-444a-9d8d-557e13353862";
const KUMANO_SPOT_NAME = "熊野本宮大社";
const KUMANO_FILE_TITLE = "Tanabe Kumano Hongu-Taisha Ichi-no-Torii.jpg";

const YOBUKO_PLACE_ID = "db8cb1f8-b765-4be8-9107-152d5ad33ec3";
const YOBUKO_PHOTO_ID = "3f0ed46b-62d4-4a3e-94e4-d407b317d711";
const OLD_AUTHOR = "flickr ID; gtknj (URL)";
const NEW_AUTHOR = "gtknj";

async function main() {
  const kutaniPlace = await prisma.placeMaster.findUnique({ where: { id: KUTANI_PLACE_ID } });
  const kutaniPhoto = await prisma.photo.findUnique({ where: { id: KUTANI_PHOTO_ID } });
  if (!kutaniPlace || kutaniPlace.name !== "九谷焼窯跡展示館") throw new Error("想定と違います: 九谷焼窯跡展示館(台帳)");
  if (!kutaniPhoto) throw new Error("想定と違います: 九谷焼窯跡展示館(公式しおりの写真)");
  console.log("[確認OK] 九谷焼窯跡展示館: 台帳・公式しおりとも写真を外す");

  const kumanoPlace = await prisma.placeMaster.findUnique({ where: { id: KUMANO_PLACE_ID } });
  const kumanoPhoto = await prisma.photo.findUnique({ where: { id: KUMANO_PHOTO_ID } });
  const kumanoItin = await prisma.itinerary.findUnique({ where: { id: KUMANO_ITIN_ID }, select: { thumbnailUrl: true } });
  if (!kumanoPlace || kumanoPlace.name !== "熊野本宮大社") throw new Error("想定と違います: 熊野本宮大社(台帳)");
  if (!kumanoPhoto || !kumanoItin || kumanoItin.thumbnailUrl !== kumanoPhoto.url) throw new Error("想定と違います: 熊野本宮大社(公式しおりの表紙)");
  console.log("[確認OK] 熊野本宮大社: 台帳・公式しおり(表紙)とも一の鳥居の写真に差し替え");

  const yobukoPlace = await prisma.placeMaster.findUnique({ where: { id: YOBUKO_PLACE_ID } });
  const yobukoPhoto = await prisma.photo.findUnique({ where: { id: YOBUKO_PHOTO_ID } });
  if (!yobukoPlace || yobukoPlace.photoAuthor !== OLD_AUTHOR) throw new Error("想定と違います: 呼子朝市(台帳)");
  if (!yobukoPhoto || yobukoPhoto.author !== OLD_AUTHOR) throw new Error("想定と違います: 呼子朝市(公式しおり)");
  console.log(`[確認OK] 呼子朝市: 撮影者表示を「${OLD_AUTHOR}」→「${NEW_AUTHOR}」に直す`);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.placeMaster.update({
    where: { id: KUTANI_PLACE_ID },
    data: { photoUrl: null, photoAuthor: null, photoLicense: null, photoLicenseUrl: null, photoSourceUrl: null },
  });
  await prisma.photo.delete({ where: { id: KUTANI_PHOTO_ID } });
  console.log("  COMMITTED: 九谷焼窯跡展示館(写真を外す)");

  const result = await uploadCommonsFile(KUMANO_FILE_TITLE, KUMANO_SPOT_NAME, BLOB_PREFIX);
  if (!result) throw new Error("画像の取得・ライセンス確認に失敗しました(" + KUMANO_FILE_TITLE + ")");
  console.log("取得:", result.url, result.credit);
  await prisma.placeMaster.update({
    where: { id: KUMANO_PLACE_ID },
    data: {
      photoUrl: result.url,
      photoAuthor: result.credit.author ?? null,
      photoLicense: result.credit.license ?? null,
      photoLicenseUrl: result.credit.licenseUrl ?? null,
      photoSourceUrl: result.credit.sourceUrl ?? null,
    },
  });
  await prisma.photo.update({
    where: { id: KUMANO_PHOTO_ID },
    data: {
      url: result.url,
      sourceUrl: result.credit.sourceUrl ?? null,
      author: result.credit.author ?? null,
      license: result.credit.license ?? null,
      licenseUrl: result.credit.licenseUrl ?? null,
    },
  });
  await prisma.itinerary.update({ where: { id: KUMANO_ITIN_ID }, data: { thumbnailUrl: result.url } });
  console.log("  COMMITTED: 熊野本宮大社(台帳・公式しおり・表紙を一の鳥居の写真に差し替え)");

  await prisma.placeMaster.update({ where: { id: YOBUKO_PLACE_ID }, data: { photoAuthor: NEW_AUTHOR } });
  await prisma.photo.update({ where: { id: YOBUKO_PHOTO_ID }, data: { author: NEW_AUTHOR } });
  console.log("  COMMITTED: 呼子朝市(撮影者表示を直す)");
}
main().finally(() => prisma.$disconnect());

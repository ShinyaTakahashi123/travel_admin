/**
 * 最終バッチを送る前の制作側の見比べで見つけた1件(台帳のみ、まだ未登録)と、法務の
 * バッチ12レビュー(2026-10-13)で見つかった場所違い2件(台帳+公式しおり)を直す。
 *
 * 【台帳のみ、まだ未登録】
 * - 櫻正宗記念館「櫻宴」(兵庫県): 元候補は古い広告ポスターの絵(北野恒富画)で、
 *   記念館の建物ではなかった。Commonsに建物の写真が見つからないため、写真なしにする。
 *
 * 【台帳+公式しおり、法務指摘(場所が違う2件)】
 * - 夢京橋キャッスルロード ← 彦根城の天守の写真(最初の100件で別の項目から外した
 *   のと同じ写真が、同じ名前の台帳の項目に入っていた)。台帳は1件のみ(重複なし)。
 *   町並みの写真に差し替え(台帳+公式しおり4スポット)。
 * - 満願寺 ← Kurokawa_onsen_001.JPG: 黒川温泉の山あいの家並みの写真で、満願寺では
 *   なかった。寺の山門の写真に差し替え(台帳+公式しおり1スポット、表紙)。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "placemaster-fix-20261013-15";

const SAKURAMASAMUNE_NAME = "櫻正宗記念館「櫻宴」";
const SAKURAMASAMUNE_PREF = "兵庫県";

const YUMEKYOBASHI_PLACE_ID = "5a5f2242-087f-4b68-bc51-c3df1d67314e";
const YUMEKYOBASHI_FILE_TITLE = "Yume-Kyobashi castle road. Hikone, Shiga.JPG";
// 公式しおり4スポットのうち、実際に間違った彦根城の写真が入っているのは1件だけ(表紙)。
// 残り3件は別途すでに正しい写真が入っているか、そもそも写真が無い(2026-10-13確認)。
const YUMEKYOBASHI_PHOTO_ID = "9b7df6c5-18ce-4b4c-b468-edb41aedc812";
const YUMEKYOBASHI_SPOT_ID = "5d59a977-65bc-4450-8dbc-ddb43294c70d";
const YUMEKYOBASHI_ITIN_ID = "ebe67d3c-6449-41d9-ba8f-c951cb74f968";

const MANGANJI_PLACE_ID = "caefd537-0568-4290-a7fc-b7ab8d7b1f6d";
const MANGANJI_FILE_TITLE = "満願寺（南小国町）山門.jpg";
const MANGANJI_PHOTO_ID = "f1625f36-24fa-4e23-abfb-91d6ad6b4fcd";
const MANGANJI_SPOT_ID = "49f1923d-bca5-412b-9741-04da635b33b5";
const MANGANJI_ITIN_ID = "357983ef-fff3-496a-8a92-1f236f8f24bd";

async function main() {
  const prefectures = await prisma.area.findMany({ where: { level: "prefecture" }, select: { id: true, name: true } });
  const prefMap = new Map(prefectures.map((a) => [a.name, a.id]));

  const sakuraPlace = await prisma.placeMaster.findFirst({ where: { name: SAKURAMASAMUNE_NAME, prefectureAreaId: prefMap.get(SAKURAMASAMUNE_PREF) || null } });
  if (!sakuraPlace) throw new Error("台帳が見つかりません: " + SAKURAMASAMUNE_NAME);
  if (sakuraPlace.photoUrl) throw new Error("既に写真があります(想定外): " + SAKURAMASAMUNE_NAME);
  console.log(`[確認OK] ${SAKURAMASAMUNE_NAME}(${SAKURAMASAMUNE_PREF}) | 元候補は古い広告ポスターの絵で、記念館の建物ではなかった → 写真なしにする`);

  const yumekyobashiPlace = await prisma.placeMaster.findUnique({ where: { id: YUMEKYOBASHI_PLACE_ID } });
  if (!yumekyobashiPlace || yumekyobashiPlace.name !== "夢京橋キャッスルロード") throw new Error("想定と違います: 夢京橋キャッスルロード(台帳)");
  const yumekyobashiPhoto = await prisma.photo.findUnique({ where: { id: YUMEKYOBASHI_PHOTO_ID } });
  const yumekyobashiItin = await prisma.itinerary.findUnique({ where: { id: YUMEKYOBASHI_ITIN_ID }, select: { thumbnailUrl: true } });
  if (!yumekyobashiPhoto || yumekyobashiPhoto.spotId !== YUMEKYOBASHI_SPOT_ID) throw new Error("想定と違います: 夢京橋キャッスルロード(公式しおりの写真)");
  if (!yumekyobashiItin || yumekyobashiItin.thumbnailUrl !== yumekyobashiPhoto.url) throw new Error("想定と違います: 夢京橋キャッスルロード(表紙)");
  console.log(`[確認OK] 夢京橋キャッスルロード | 彦根城の天守の写真だった(重複する台帳は無し、1件のみ。公式しおり4スポットのうち間違った写真が入っていたのは1件のみ、残りは既に正しい写真か写真なし) | 台帳+公式しおり1スポット(表紙)を差し替え`);

  const manganjiPlace = await prisma.placeMaster.findUnique({ where: { id: MANGANJI_PLACE_ID } });
  const manganjiPhoto = await prisma.photo.findUnique({ where: { id: MANGANJI_PHOTO_ID } });
  const manganjiItin = await prisma.itinerary.findUnique({ where: { id: MANGANJI_ITIN_ID }, select: { thumbnailUrl: true } });
  if (!manganjiPlace || manganjiPlace.name !== "満願寺") throw new Error("想定と違います: 満願寺(台帳)");
  if (!manganjiPhoto || manganjiPhoto.spotId !== MANGANJI_SPOT_ID) throw new Error("想定と違います: 満願寺(公式しおり)");
  if (!manganjiItin || manganjiItin.thumbnailUrl !== manganjiPhoto.url) throw new Error("想定と違います: 満願寺(表紙)");
  console.log(`[確認OK] 満願寺 | 黒川温泉の家並みの写真だった | 台帳+公式しおり1スポット(表紙)を差し替え`);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.placeMaster.update({
    where: { id: sakuraPlace.id },
    data: { photoUrl: null, photoAuthor: null, photoLicense: null, photoLicenseUrl: null, photoSourceUrl: null },
  });
  console.log(`  COMMITTED: ${SAKURAMASAMUNE_NAME}(写真なし)`);

  const yumekyobashiResult = await uploadCommonsFile(YUMEKYOBASHI_FILE_TITLE, "夢京橋キャッスルロード", BLOB_PREFIX);
  if (!yumekyobashiResult) throw new Error("画像の取得・ライセンス確認に失敗しました(" + YUMEKYOBASHI_FILE_TITLE + ")");
  console.log("取得:", yumekyobashiResult.url, yumekyobashiResult.credit);
  await prisma.placeMaster.update({
    where: { id: YUMEKYOBASHI_PLACE_ID },
    data: {
      photoUrl: yumekyobashiResult.url,
      photoAuthor: yumekyobashiResult.credit.author ?? null,
      photoLicense: yumekyobashiResult.credit.license ?? null,
      photoLicenseUrl: yumekyobashiResult.credit.licenseUrl ?? null,
      photoSourceUrl: yumekyobashiResult.credit.sourceUrl ?? null,
    },
  });
  await prisma.photo.update({
    where: { id: YUMEKYOBASHI_PHOTO_ID },
    data: {
      url: yumekyobashiResult.url,
      sourceUrl: yumekyobashiResult.credit.sourceUrl ?? null,
      author: yumekyobashiResult.credit.author ?? null,
      license: yumekyobashiResult.credit.license ?? null,
      licenseUrl: yumekyobashiResult.credit.licenseUrl ?? null,
    },
  });
  await prisma.itinerary.update({ where: { id: YUMEKYOBASHI_ITIN_ID }, data: { thumbnailUrl: yumekyobashiResult.url } });
  console.log("  COMMITTED: 夢京橋キャッスルロード(台帳+公式しおり1スポット・表紙)");

  const manganjiResult = await uploadCommonsFile(MANGANJI_FILE_TITLE, "満願寺", BLOB_PREFIX);
  if (!manganjiResult) throw new Error("画像の取得・ライセンス確認に失敗しました(" + MANGANJI_FILE_TITLE + ")");
  console.log("取得:", manganjiResult.url, manganjiResult.credit);
  await prisma.placeMaster.update({
    where: { id: MANGANJI_PLACE_ID },
    data: {
      photoUrl: manganjiResult.url,
      photoAuthor: manganjiResult.credit.author ?? null,
      photoLicense: manganjiResult.credit.license ?? null,
      photoLicenseUrl: manganjiResult.credit.licenseUrl ?? null,
      photoSourceUrl: manganjiResult.credit.sourceUrl ?? null,
    },
  });
  await prisma.photo.update({
    where: { id: MANGANJI_PHOTO_ID },
    data: {
      url: manganjiResult.url,
      sourceUrl: manganjiResult.credit.sourceUrl ?? null,
      author: manganjiResult.credit.author ?? null,
      license: manganjiResult.credit.license ?? null,
      licenseUrl: manganjiResult.credit.licenseUrl ?? null,
    },
  });
  await prisma.itinerary.update({ where: { id: MANGANJI_ITIN_ID }, data: { thumbnailUrl: manganjiResult.url } });
  console.log("  COMMITTED: 満願寺(台帳+公式しおり1スポット・表紙)");
}
main().finally(() => prisma.$disconnect());

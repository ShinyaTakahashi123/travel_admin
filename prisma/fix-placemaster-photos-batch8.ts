/**
 * バッチ6を送る前の制作側の見比べで見つけた3件(台帳のみ)と、法務の任意の指摘(バッチ5、
 * 桜島フェリー)1件(台帳+公式しおり2本)を直す。
 * - 十和田湖遊覧船（十和田市）: 元候補は十和田湖の一般的な風景写真で、遊覧船そのものが
 *   写っていなかった。船の写真に差し替え。
 * - 出島: 元候補は出島の古い地図(Plattegrond van Deshima)で、写真ではなかった。
 *   現在の出島の建物が写った写真に差し替え。
 * - 上野動物園: 元候補はゴリラ1頭のアップで、動物園そのものが分からなかった。
 *   動物園の入口の写真(休園日で人が写っていないもの)に差し替え。
 * - 桜島フェリー: 船体のマークのアップで船そのものが分かりにくいとの指摘(法務
 *   2026-10-13、任意)。船の全体が写った写真に差し替え。台帳と、同じ写真を使っている
 *   公式しおり2本(うち1本は表紙)も直す。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "placemaster-fix-20261013-8";

type PlaceTask = { name: string; prefecture: string; fileTitle: string; reason: string };
const PLACE_TASKS: PlaceTask[] = [
  { name: "十和田湖遊覧船（十和田市）", prefecture: "青森県", fileTitle: "Lake Towada Sightseeing Boat - Lake Towada, Aomori - DSC01022.jpg", reason: "元候補は十和田湖の一般的な風景で、遊覧船が写っていなかった" },
  { name: "出島", prefecture: "長崎県", fileTitle: "Dejima Nagasaki Japan02s3.jpg", reason: "元候補は出島の古い地図で、写真ではなかった" },
  { name: "上野動物園", prefecture: "東京都", fileTitle: "Closed Ueno Zoo (5311833648).jpg", reason: "元候補はゴリラ1頭のアップで、動物園そのものが分からなかった" },
];

const SAKURAJIMA_PLACE_ID = "24fa7550-2f93-4026-8270-edec5b61d893";
const SAKURAJIMA_PHOTO_IDS = ["140aff8c-b374-4dd9-90cf-9f9c506e3f70", "0372e37b-8db2-4885-8f02-d4b5b7e76868"];
const SAKURAJIMA_COVER_ITIN_ID = "81e2778b-4a9f-4594-93a2-1bde60bae8ca";
const SAKURAJIMA_FILE_TITLE = 'Ship "Sakurajimamaru" of Sakurajima Ferry at Sakurajima Port.jpg';

async function main() {
  const prefectures = await prisma.area.findMany({ where: { level: "prefecture" }, select: { id: true, name: true } });
  const prefMap = new Map(prefectures.map((a) => [a.name, a.id]));

  for (const t of PLACE_TASKS) {
    const prefectureAreaId = prefMap.get(t.prefecture) || null;
    const place = await prisma.placeMaster.findFirst({ where: { name: t.name, prefectureAreaId } });
    if (!place) throw new Error(`台帳が見つかりません: ${t.name}`);
    if (place.photoUrl) throw new Error(`既に写真があります(想定外): ${t.name}`);
    console.log(`[確認OK] ${t.name}(${t.prefecture}) | ${t.reason}`);
  }

  const sakuraPlace = await prisma.placeMaster.findUnique({ where: { id: SAKURAJIMA_PLACE_ID } });
  const sakuraPhotos = await prisma.photo.findMany({ where: { id: { in: SAKURAJIMA_PHOTO_IDS } } });
  const sakuraCoverItin = await prisma.itinerary.findUnique({ where: { id: SAKURAJIMA_COVER_ITIN_ID }, select: { thumbnailUrl: true } });
  if (!sakuraPlace || sakuraPlace.name !== "桜島フェリー") throw new Error("想定と違います: 桜島フェリー(台帳)");
  if (sakuraPhotos.length !== 2) throw new Error("想定と違います: 桜島フェリー(公式しおりの写真)");
  const coverPhoto = sakuraPhotos.find((p) => p.url === sakuraCoverItin?.thumbnailUrl);
  if (!coverPhoto) throw new Error("想定と違います: 桜島フェリー(表紙)");
  console.log("[確認OK] 桜島フェリー: 台帳・公式しおり2本(うち1本は表紙)を船の全体写真に差し替え");

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  for (const t of PLACE_TASKS) {
    const prefectureAreaId = prefMap.get(t.prefecture) || null;
    const place = await prisma.placeMaster.findFirst({ where: { name: t.name, prefectureAreaId } });
    if (!place) throw new Error(`書き込み直前に台帳が見つかりません: ${t.name}`);
    const result = await uploadCommonsFile(t.fileTitle, t.name, BLOB_PREFIX);
    if (!result) throw new Error(`画像の取得・ライセンス確認に失敗しました(${t.fileTitle})`);
    console.log(`取得: ${result.url}`, result.credit);
    await prisma.placeMaster.update({
      where: { id: place.id },
      data: {
        photoUrl: result.url,
        photoAuthor: result.credit.author ?? null,
        photoLicense: result.credit.license ?? null,
        photoLicenseUrl: result.credit.licenseUrl ?? null,
        photoSourceUrl: result.credit.sourceUrl ?? null,
      },
    });
    console.log(`  COMMITTED: ${t.name}`);
  }

  const sakuraResult = await uploadCommonsFile(SAKURAJIMA_FILE_TITLE, "桜島フェリー", BLOB_PREFIX);
  if (!sakuraResult) throw new Error("画像の取得・ライセンス確認に失敗しました(" + SAKURAJIMA_FILE_TITLE + ")");
  console.log("取得:", sakuraResult.url, sakuraResult.credit);
  await prisma.placeMaster.update({
    where: { id: SAKURAJIMA_PLACE_ID },
    data: {
      photoUrl: sakuraResult.url,
      photoAuthor: sakuraResult.credit.author ?? null,
      photoLicense: sakuraResult.credit.license ?? null,
      photoLicenseUrl: sakuraResult.credit.licenseUrl ?? null,
      photoSourceUrl: sakuraResult.credit.sourceUrl ?? null,
    },
  });
  for (const p of sakuraPhotos) {
    await prisma.photo.update({
      where: { id: p.id },
      data: {
        url: sakuraResult.url,
        sourceUrl: sakuraResult.credit.sourceUrl ?? null,
        author: sakuraResult.credit.author ?? null,
        license: sakuraResult.credit.license ?? null,
        licenseUrl: sakuraResult.credit.licenseUrl ?? null,
      },
    });
  }
  await prisma.itinerary.update({ where: { id: SAKURAJIMA_COVER_ITIN_ID }, data: { thumbnailUrl: sakuraResult.url } });
  console.log("  COMMITTED: 桜島フェリー(台帳・公式しおり2本・表紙)");
}
main().finally(() => prisma.$disconnect());

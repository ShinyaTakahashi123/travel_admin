/**
 * バッチ12を送る前の制作側の見比べで見つけた2件(台帳のみ、まだ未登録)と、法務の
 * 任意の指摘(バッチ11、熱海銀座商店街)1件(台帳+公式しおり)を直す。
 * - 平賀源内記念館(香川県): 元候補は平賀源内の肖像画(浮世絵)で、記念館の建物では
 *   なかった。Commonsに建物の写真が見つからないため、写真なしにする。
 * - 勿来の関公園(福島県): 元候補は源義家の浮世絵で、公園の写真ではなかった。
 *   Commonsに公園の写真が見つからないため、写真なしにする。
 * - 熱海銀座商店街(静岡県): 熱海の町を高い所から見た写真で、商店街が分からない
 *   との指摘(法務2026-10-13、任意)。商店街の入口が写った写真に差し替え。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "placemaster-fix-20261013-14";

type RemoveTask = { name: string; prefecture: string; reason: string };
const REMOVE_TASKS: RemoveTask[] = [
  { name: "平賀源内記念館", prefecture: "香川県", reason: "元候補は平賀源内の肖像画(浮世絵)で、記念館の建物ではなかった。Commonsに建物の写真が見つからない" },
  { name: "勿来の関公園", prefecture: "福島県", reason: "元候補は源義家の浮世絵で、公園の写真ではなかった。Commonsに公園の写真が見つからない" },
];

const ATAMI_PLACE_NAME = "熱海銀座商店街";
const ATAMI_PREF = "静岡県";
const ATAMI_FILE_TITLE = "RZ Atami Ginza Theater A.jpg";
const ATAMI_PHOTO_ID = "9f5b6cbc-b624-44a6-b6ea-f4ce27676a89";
const ATAMI_SPOT_ID = "fd9b4413-f07e-4f40-b5ff-0f0ce42e891b";

async function main() {
  const prefectures = await prisma.area.findMany({ where: { level: "prefecture" }, select: { id: true, name: true } });
  const prefMap = new Map(prefectures.map((a) => [a.name, a.id]));

  for (const t of REMOVE_TASKS) {
    const prefectureAreaId = prefMap.get(t.prefecture) || null;
    const place = await prisma.placeMaster.findFirst({ where: { name: t.name, prefectureAreaId } });
    if (!place) throw new Error(`台帳が見つかりません: ${t.name}`);
    if (place.photoUrl) throw new Error(`既に写真があります(想定外): ${t.name}`);
    console.log(`[確認OK] ${t.name}(${t.prefecture}) | ${t.reason} → 写真なしにする`);
  }

  const atamiPlace = await prisma.placeMaster.findFirst({ where: { name: ATAMI_PLACE_NAME, prefectureAreaId: prefMap.get(ATAMI_PREF) || null } });
  const atamiPhoto = await prisma.photo.findUnique({ where: { id: ATAMI_PHOTO_ID } });
  if (!atamiPlace) throw new Error("台帳が見つかりません: " + ATAMI_PLACE_NAME);
  if (!atamiPhoto || atamiPhoto.spotId !== ATAMI_SPOT_ID) throw new Error("想定と違います(公式しおり): " + ATAMI_PLACE_NAME);
  console.log(`[確認OK] ${ATAMI_PLACE_NAME}(${ATAMI_PREF}) | 熱海の町を高い所から見た写真で、商店街が分からなかった(法務2026-10-13任意指摘) | 台帳+公式しおり1スポットを差し替え`);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  for (const t of REMOVE_TASKS) {
    const prefectureAreaId = prefMap.get(t.prefecture) || null;
    const place = await prisma.placeMaster.findFirst({ where: { name: t.name, prefectureAreaId } });
    if (!place) throw new Error(`書き込み直前に台帳が見つかりません: ${t.name}`);
    await prisma.placeMaster.update({
      where: { id: place.id },
      data: { photoUrl: null, photoAuthor: null, photoLicense: null, photoLicenseUrl: null, photoSourceUrl: null },
    });
    console.log(`  COMMITTED: ${t.name}(写真なし)`);
  }

  const result = await uploadCommonsFile(ATAMI_FILE_TITLE, ATAMI_PLACE_NAME, BLOB_PREFIX);
  if (!result) throw new Error("画像の取得・ライセンス確認に失敗しました(" + ATAMI_FILE_TITLE + ")");
  console.log("取得:", result.url, result.credit);
  await prisma.placeMaster.update({
    where: { id: atamiPlace.id },
    data: {
      photoUrl: result.url,
      photoAuthor: result.credit.author ?? null,
      photoLicense: result.credit.license ?? null,
      photoLicenseUrl: result.credit.licenseUrl ?? null,
      photoSourceUrl: result.credit.sourceUrl ?? null,
    },
  });
  await prisma.photo.update({
    where: { id: ATAMI_PHOTO_ID },
    data: {
      url: result.url,
      sourceUrl: result.credit.sourceUrl ?? null,
      author: result.credit.author ?? null,
      license: result.credit.license ?? null,
      licenseUrl: result.credit.licenseUrl ?? null,
    },
  });
  console.log("  COMMITTED: " + ATAMI_PLACE_NAME + "(台帳+公式しおり)");
}
main().finally(() => prisma.$disconnect());

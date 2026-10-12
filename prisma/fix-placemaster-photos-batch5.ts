/**
 * 法務の任意の指摘(2026-10-13 01:17)で見つかった1件を直す。
 * 旧大阪商船: 旧写真は門司港レトロ全体を高所から見た写真で、建物そのものが
 * 分かりにくかった。建物そのものが写った写真に差し替え。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "placemaster-fix-20261013-5";
const NAME = "旧大阪商船";
const PREF = "福岡県";
const FILE_TITLE = "Former Osaka Shosen Moji Branch Office 2008.jpg";

async function main() {
  const prefectures = await prisma.area.findMany({ where: { level: "prefecture" }, select: { id: true, name: true } });
  const prefMap = new Map(prefectures.map((a) => [a.name, a.id]));
  const place = await prisma.placeMaster.findFirst({ where: { name: NAME, prefectureAreaId: prefMap.get(PREF) || null } });
  if (!place) throw new Error("台帳が見つかりません: " + NAME);
  console.log(`[確認OK] ${NAME}(${PREF}) | 旧写真は門司港レトロ全体の高所からの写真で、建物が分かりにくかった`);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  const result = await uploadCommonsFile(FILE_TITLE, NAME, BLOB_PREFIX);
  if (!result) throw new Error("画像の取得・ライセンス確認に失敗しました(" + FILE_TITLE + ")");
  console.log("取得:", result.url, result.credit);
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
  console.log("  COMMITTED:", NAME);
}
main().finally(() => prisma.$disconnect());

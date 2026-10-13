/**
 * 法務のバッチ7レビュー(2026-10-13 09:06)で見つかった1件を直す。
 * 石ヶ戸(青森県): Oirase-keiryu.jpgはCommonsの説明が「奥入瀬渓流の光景」で、
 * 石ヶ戸(岩屋)そのものの写真ではなかった(公式しおり3b17f9a0で5スポットに
 * 使い回されていたのと同じ写真。この使い回し自体は企画運営の指示で「あとでよい」
 * グループへ別途対応)。石ヶ戸の岩屋そのものが写った写真に差し替える。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "placemaster-fix-20261013-10";
const NAME = "石ヶ戸";
const PREF = "青森県";
const FILE_TITLE = "Ishigedo - Oirase Mountain Stream - Towada, Aomori - DSC01009.jpg";

async function main() {
  const prefectures = await prisma.area.findMany({ where: { level: "prefecture" }, select: { id: true, name: true } });
  const prefMap = new Map(prefectures.map((a) => [a.name, a.id]));
  const place = await prisma.placeMaster.findFirst({ where: { name: NAME, prefectureAreaId: prefMap.get(PREF) || null } });
  if (!place) throw new Error("台帳が見つかりません: " + NAME);
  console.log(`[確認OK] ${NAME}(${PREF}) | 元の写真は奥入瀬渓流の一般的な光景で、石ヶ戸(岩屋)そのものではなかった`);

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

/**
 * バッチ5を送る前の制作側の見比べで見つけた1件を直す。
 * 高城山展望台: 元の候補写真(Cherry_blossoms_at_Yoshinoyama_01.jpg)は吉野山の桜の
 * 一般的な風景写真で、展望台そのものが写っていなかった。展望台の建物(「高城山休憩所」の
 * 看板あり)が写った写真(吉野山 高城山展望台 Takagiyama 2013.4.09 - panoramio.jpg、
 * CC BY-SA 3.0)に差し替える。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "placemaster-fix-20261013-7";
const NAME = "高城山展望台";
const PREF = "奈良県";
const FILE_TITLE = "吉野山 高城山展望台 Takagiyama 2013.4.09 - panoramio.jpg";

async function main() {
  const prefectures = await prisma.area.findMany({ where: { level: "prefecture" }, select: { id: true, name: true } });
  const prefMap = new Map(prefectures.map((a) => [a.name, a.id]));
  const place = await prisma.placeMaster.findFirst({ where: { name: NAME, prefectureAreaId: prefMap.get(PREF) || null } });
  if (!place) throw new Error("台帳が見つかりません: " + NAME);
  if (place.photoUrl) throw new Error("既に写真があります(想定外): " + NAME);
  console.log(`[確認OK] ${NAME}(${PREF}) | 元の候補は展望台そのものが写っていなかった`);

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

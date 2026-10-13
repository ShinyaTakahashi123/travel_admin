/**
 * バッチ9を送る前の制作側の見比べで見つけた1件(台帳のみ、まだ未登録)と、法務の
 * 任意の指摘(バッチ8、台場公園)1件(台帳のみ、既に登録済み)を直す。
 * - 中禅寺湖遊覧船: 元候補は中禅寺湖の一般的な風景写真で、遊覧船そのものが
 *   写っていなかった。遊覧船(けごん)の写真に差し替え。
 * - 台場公園: お台場の高層ビル群を海から見た写真で、台場(砲台跡)そのものが
 *   分かりにくいとの指摘(法務2026-10-13、任意)。砲台跡が写った写真に差し替え。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "placemaster-fix-20261013-11";

type Task = { name: string; prefecture: string; fileTitle: string; reason: string };
const TASKS: Task[] = [
  { name: "中禅寺湖遊覧船", prefecture: "栃木県", fileTitle: "Sightseeing ship Kegon.jpg", reason: "元候補は中禅寺湖の一般的な風景で、遊覧船そのものが写っていなかった" },
  { name: "台場公園", prefecture: "東京都", fileTitle: "台場公園、砲台跡 - panoramio.jpg", reason: "お台場の高層ビル群を海から見た写真で、台場(砲台跡)そのものが分かりにくかった(法務2026-10-13任意指摘)" },
];

async function main() {
  const prefectures = await prisma.area.findMany({ where: { level: "prefecture" }, select: { id: true, name: true } });
  const prefMap = new Map(prefectures.map((a) => [a.name, a.id]));

  for (const t of TASKS) {
    const prefectureAreaId = prefMap.get(t.prefecture) || null;
    const place = await prisma.placeMaster.findFirst({ where: { name: t.name, prefectureAreaId } });
    if (!place) throw new Error(`台帳が見つかりません: ${t.name}`);
    console.log(`[確認OK] ${t.name}(${t.prefecture}) | ${t.reason}`);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  for (const t of TASKS) {
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
}
main().finally(() => prisma.$disconnect());

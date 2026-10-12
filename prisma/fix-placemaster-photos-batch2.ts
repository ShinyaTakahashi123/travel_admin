/**
 * 台帳への写真追加バッチ2で、法務に送る前の制作側の見比べ(企画運営の指示2026-10-13)で
 * 見つかった2件の場所の取り違えを直す。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "placemaster-fix-20261013-2";

type Task = { name: string; prefecture: string; fileTitle: string; reason: string };

const TASKS: Task[] = [
  { name: "雲井の滝", prefecture: "青森県", fileTitle: "2021 Oirase Mountain Stream, Kumoi Falls 001.jpg", reason: "旧写真は奥入瀬渓流の一般的な流れで、滝そのものが写っていなかった" },
  { name: "乙女の像", prefecture: "青森県", fileTitle: "Statue of Lake Towada Otome.jpg", reason: "旧写真は十和田湖の一般的な景色で、像そのものが写っていなかった" },
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

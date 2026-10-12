/**
 * バッチ3を法務に送る前の制作側の見比べで見つけた2件を直す。
 * - 久保田一竹美術館: 旧写真は河口湖の真上からの空撮(KawaguchiKo.jpg、同じ写真が
 *   大石公園/大観峰の候補でも真上からの空撮として問題になっていたもの)で、美術館の
 *   建物ではなかった。入口の門の写真に差し替え。
 * - 岩手県立美術館: 旧写真は館内ロビーで、展覧会のポスター(ロダン展)と来館者が
 *   近距離に写っていた。建物外観の写真に差し替え(外観にも展覧会の小さな案内板が
 *   写っているが、建物が主題のため問題ない)。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "placemaster-fix-20261013-4";

type Task = { name: string; prefecture: string; fileTitle: string; reason: string };

const TASKS: Task[] = [
  { name: "久保田一竹美術館", prefecture: "山梨県", fileTitle: "Itchiku Kubota Art Museum 2018a.jpg", reason: "旧写真は河口湖の真上からの空撮で、美術館の建物ではなかった" },
  { name: "岩手県立美術館", prefecture: "岩手県", fileTitle: "Iwate Museum of Art.jpg", reason: "旧写真は館内ロビーで、展覧会ポスターと来館者が近距離に写っていた" },
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

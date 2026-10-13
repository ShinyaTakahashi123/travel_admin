/**
 * バッチ10を送る前の制作側の見比べで見つけた2件(台帳のみ、まだ未登録)と、法務の
 * バッチ9レビュー(2026-10-13)で見つかった2件(必須)+1件(任意)(台帳+公式しおり)を直す。
 *
 * 【台帳のみ、まだ未登録】
 * - 東山遊歩道(岐阜県): 元候補は遊歩道沿いの1寺院(宗猷寺)の門の写真で、遊歩道
 *   そのものではなかった。遊歩道の実際の光景が写った写真に差し替え。
 * - 湯畑(群馬県): 元候補がそもそも動画ファイル(.webm)で写真ではなかった。
 *   湯畑の写真に差し替え。
 *
 * 【台帳+公式しおり、法務指摘(必須2件)】
 * - 壇ノ浦古戦場 ← AntokuTennou_Engi.7&8_Dannoura_Kassen.jpg: 安徳天皇縁起絵の
 *   合戦の場面の絵で、場所の写真ではなかった。古戦場の碑の写真に差し替え。
 * - 秩父まつり会館 ← ChichibuFes1.jpg: 夜祭の屋台の写真で、会館の建物ではな
 *   かった。会館の建物が写った写真に差し替え。
 *
 * 【台帳+公式しおり、法務指摘(任意1件)】
 * - 谷茶ビーチ ← 谷茶前の碑.jpg: 「谷茶前節」の碑の写真で、浜そのものは写って
 *   いなかった(法務2026-10-13任意指摘)。浜の写真に差し替え。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "placemaster-fix-20261013-12";

type PlaceOnlyTask = { name: string; prefecture: string; fileTitle: string; reason: string };
const PLACE_ONLY_TASKS: PlaceOnlyTask[] = [
  { name: "東山遊歩道", prefecture: "岐阜県", fileTitle: "20131010 36 Takayama - Higashiyama Walking Course (10491235685).jpg", reason: "元候補は遊歩道沿いの1寺院(宗猷寺)の門の写真で、遊歩道そのものではなかった" },
  { name: "湯畑", prefecture: "群馬県", fileTitle: "251130 Yubatake, Kusatsu 02.jpg", reason: "元候補がそもそも動画ファイル(.webm)で写真ではなかった" },
];

type PlaceAndOfficialTask = { name: string; prefecture: string; fileTitle: string; photoId: string; spotId: string; reason: string };
const PLACE_AND_OFFICIAL_TASKS: PlaceAndOfficialTask[] = [
  { name: "壇ノ浦古戦場", prefecture: "山口県", fileTitle: "Dan-no-ura kosen-jo.JPG", photoId: "81413f96-aea1-4663-88fe-5b922c513742", spotId: "0a4e69f2-e3db-47e9-8777-365ddf5e7d2e", reason: "安徳天皇縁起絵の合戦の場面の絵で、場所の写真ではなかった" },
  { name: "秩父まつり会館", prefecture: "埼玉県", fileTitle: "Chichibu Matsuri Kaikan.JPG", photoId: "badc2564-de78-4542-b3d7-54882eec28c3", spotId: "a9c051ec-2f43-4f58-ba46-bb19590f7387", reason: "夜祭の屋台の写真で、会館の建物ではなかった" },
  { name: "谷茶ビーチ", prefecture: "沖縄県", fileTitle: "Tancha Beach in Onna, -20 maart 2017, 18-00.jpg", photoId: "6b1c29c1-67eb-4c1a-96b4-e12877387d6b", spotId: "4d3cfff5-6bd9-4248-9c71-efd4bc9401d4", reason: "「谷茶前節」の碑の写真で、浜そのものは写っていなかった(法務2026-10-13任意指摘)" },
];

async function main() {
  const prefectures = await prisma.area.findMany({ where: { level: "prefecture" }, select: { id: true, name: true } });
  const prefMap = new Map(prefectures.map((a) => [a.name, a.id]));

  for (const t of PLACE_ONLY_TASKS) {
    const prefectureAreaId = prefMap.get(t.prefecture) || null;
    const place = await prisma.placeMaster.findFirst({ where: { name: t.name, prefectureAreaId } });
    if (!place) throw new Error(`台帳が見つかりません: ${t.name}`);
    if (place.photoUrl) throw new Error(`既に写真があります(想定外): ${t.name}`);
    console.log(`[確認OK] ${t.name}(${t.prefecture}) | ${t.reason}`);
  }

  for (const t of PLACE_AND_OFFICIAL_TASKS) {
    const prefectureAreaId = prefMap.get(t.prefecture) || null;
    const place = await prisma.placeMaster.findFirst({ where: { name: t.name, prefectureAreaId } });
    const photo = await prisma.photo.findUnique({ where: { id: t.photoId } });
    if (!place) throw new Error(`台帳が見つかりません: ${t.name}`);
    if (!photo || photo.spotId !== t.spotId) throw new Error(`想定と違います(公式しおり): ${t.name}`);
    console.log(`[確認OK] ${t.name}(${t.prefecture}) | ${t.reason} | 台帳+公式しおり1スポットを差し替え`);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  for (const t of PLACE_ONLY_TASKS) {
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

  for (const t of PLACE_AND_OFFICIAL_TASKS) {
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
    await prisma.photo.update({
      where: { id: t.photoId },
      data: {
        url: result.url,
        sourceUrl: result.credit.sourceUrl ?? null,
        author: result.credit.author ?? null,
        license: result.credit.license ?? null,
        licenseUrl: result.credit.licenseUrl ?? null,
      },
    });
    console.log(`  COMMITTED: ${t.name}(台帳+公式しおり)`);
  }
}
main().finally(() => prisma.$disconnect());

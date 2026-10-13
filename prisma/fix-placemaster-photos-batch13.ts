/**
 * バッチ11を送る前の制作側の見比べで見つけた3件(台帳のみ、まだ未登録)と、法務の
 * バッチ10レビュー(2026-10-13)で見つかった道頓堀(必須、台帳+公式しおり3スポット)・
 * 湯の川温泉(任意、台帳+公式しおり1スポット)を直す。奈半利の町並み(任意)は、
 * Commonsに町並みそのものの代わりの写真が見つからなかったため、今回は見送る
 * (企画運営・法務に理由を報告)。
 *
 * 【台帳のみ、まだ未登録】
 * - 磐梯山噴火記念館: 元候補は磐梯山そのものの写真で、記念館の建物ではなかった。
 *   Commonsに建物の写真が見つからないため、写真なしにする。
 * - 桧原湖遊覧船: 元候補は桧原湖からの磐梯山の一般的な風景で、遊覧船そのものが
 *   写っていなかった。Commonsに遊覧船の写真が見つからないため、写真なしにする。
 * - 尾道市街地～向島: 元候補はしまなみ海道沿いの一般的な道路の写真で、尾道市街地
 *   や向島が分かりにくかった。尾道水道越しに向島を望む写真に差し替え。
 *
 * 【台帳+公式しおり、法務指摘(必須)】
 * - 道頓堀 ← Osaka_Dotonbori_Ebisu_Bridge.jpg: グリコ・アサヒなどの企業広告看板
 *   が写真の中心だった。看板が中心でない道頓堀川の写真に差し替え(台帳+公式しおり
 *   3スポット)。
 *
 * 【台帳+公式しおり、法務指摘(任意)】
 * - 湯の川温泉 ← 湯の川温泉停留場・全景: 市電の停留場の写真で、温泉街そのもの
 *   ではなかった(法務2026-10-13任意指摘)。温泉街の通りの写真に差し替え
 *   (台帳+公式しおり1スポット)。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "placemaster-fix-20261013-13";

type RemoveTask = { name: string; prefecture: string; reason: string };
const REMOVE_TASKS: RemoveTask[] = [
  { name: "磐梯山噴火記念館", prefecture: "福島県", reason: "元候補は磐梯山そのものの写真で、記念館の建物ではなかった。Commonsに建物の写真が見つからない" },
  { name: "桧原湖遊覧船", prefecture: "福島県", reason: "元候補は桧原湖からの磐梯山の一般的な風景で、遊覧船そのものが写っていなかった。Commonsに遊覧船の写真が見つからない" },
];

type PlaceOnlyTask = { name: string; prefecture: string; fileTitle: string; reason: string };
const PLACE_ONLY_TASKS: PlaceOnlyTask[] = [
  { name: "尾道市街地～向島", prefecture: "広島県", fileTitle: "Onomichi Channel and Mount Iwayayama on Mukaishima Island.jpg", reason: "元候補はしまなみ海道沿いの一般的な道路の写真で、尾道市街地や向島が分かりにくかった" },
];

type PlaceAndOfficialTask = { name: string; prefecture: string; fileTitle: string; photoIds: string[]; spotIds: string[]; reason: string };
const PLACE_AND_OFFICIAL_TASKS: PlaceAndOfficialTask[] = [
  {
    name: "道頓堀", prefecture: "大阪府", fileTitle: "Dōtonbori Canal 1.jpg",
    photoIds: ["dc91e2a4-32e5-4682-b585-45eb064a3518", "80f934d5-aee3-4c25-9f2d-adbd7ca73255", "45643da1-1229-4b81-8ec6-f6841bcdc221"],
    spotIds: ["4ac94450-4892-448e-8772-f765c443fe40", "a4a3d6b7-d6e9-40b3-8b47-7c05fb1f7cb6", "367d1272-6ee1-43aa-9b17-fbb38fe1bb79"],
    reason: "グリコ・アサヒなどの企業広告看板が写真の中心だった",
  },
  {
    name: "湯の川温泉", prefecture: "北海道", fileTitle: "Yunokawa Onsen Hakodate Hokkaido Japan01s3.jpg",
    photoIds: ["65701be9-dd95-470f-9fe9-6847ef5e513f"],
    spotIds: ["353b0e29-8d5b-4387-8a75-daca3c659ecd"],
    reason: "市電の停留場の写真で、温泉街そのものではなかった(法務2026-10-13任意指摘)",
  },
];

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
    if (!place) throw new Error(`台帳が見つかりません: ${t.name}`);
    for (let i = 0; i < t.photoIds.length; i++) {
      const photo = await prisma.photo.findUnique({ where: { id: t.photoIds[i] } });
      if (!photo || photo.spotId !== t.spotIds[i]) throw new Error(`想定と違います(公式しおり): ${t.name}`);
    }
    console.log(`[確認OK] ${t.name}(${t.prefecture}) | ${t.reason} | 台帳+公式しおり${t.photoIds.length}スポットを差し替え`);
  }

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
    for (const photoId of t.photoIds) {
      await prisma.photo.update({
        where: { id: photoId },
        data: {
          url: result.url,
          sourceUrl: result.credit.sourceUrl ?? null,
          author: result.credit.author ?? null,
          license: result.credit.license ?? null,
          licenseUrl: result.credit.licenseUrl ?? null,
        },
      });
    }
    console.log(`  COMMITTED: ${t.name}(台帳+公式しおり${t.photoIds.length}スポット)`);
  }
}
main().finally(() => prisma.$disconnect());

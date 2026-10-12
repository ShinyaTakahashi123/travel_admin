/**
 * 法務の2回目の確認(10/13 00:36)で見つかった、batch2/batch3の差し替えの中の4件の
 * 新しい問題を直す。
 * - 館内の美術作品(テームラボ): 著作権法46条の範囲外のため、建物外観の元の写真に戻す
 * - 店の大きな看板が中心(でんでんタウン): 別の街並み写真に差し替え
 * - 自動販売機のロゴ・値段のアップ(湯布院フローラルヴィレッジ): Commonsに他の写真がなく削除のみ
 * - 売り場内の人が多い(道の駅あらかわ): 建物外観の写真に差し替え
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photofix-20261013-b4";

type Task = {
  photoId: string;
  spotId: string;
  itinId: string;
  isCover: boolean;
  fileTitle: string | null;
  caption: string;
  reason: string;
};

const TASKS: Task[] = [
  { photoId: "e029b9f5-8c96-4078-8cfa-441b22a4fbbf", spotId: "a960129e-1879-47c5-86c6-e780c18443c1", itinId: "c27fe728-37c2-4ca0-9bac-06451d485ff2", isCover: false, fileTitle: "Teamlab toyosu.jpg", caption: "チームラボプラネッツ", reason: "館内の光の作品が写っており著作権法46条の範囲外(法務指摘10/13 00:36)。建物外観の元の写真に戻す" },
  { photoId: "4b694365-0337-485b-9548-7b062c210fba", spotId: "9f4b9493-fe2a-47d7-8381-863b10613468", itinId: "406e5c96-ffef-4536-a312-0204de681b97", isCover: false, fileTitle: "Den den town, osaka.JPG", caption: "でんでんタウン", reason: "店の大きな看板(DenDen LAND・KIDS LAND Joshin)が中心だった(法務指摘)。街並み全体の写真に差し替え" },
  { photoId: "cc1854e8-693c-4f99-b3f4-025b058b75f9", spotId: "6c72cfbc-3049-4003-9252-b275a316d94e", itinId: "66258009-2007-49b0-a1b5-fdb3131a4b15", isCover: false, fileTitle: null, caption: "湯布院フローラルヴィレッジ", reason: "自動販売機のロゴ・値段のアップだった(法務指摘)。Commonsに他の写真が見つからず削除のみ" },
  { photoId: "e23c2bab-48fa-4334-966f-1d035a5f5124", spotId: "76e4d961-43af-4548-991b-9e5fab90bbde", itinId: "15185f58-5c6a-441b-a1a0-321b50f7a606", isCover: false, fileTitle: "Michinoeki Arakawa 06.jpg", caption: "道の駅あらかわ", reason: "売り場内の人が多かった(法務指摘)。建物外観の写真に差し替え" },
];

async function main() {
  for (const t of TASKS) {
    const photo = await prisma.photo.findUnique({ where: { id: t.photoId } });
    if (!photo) throw new Error(`写真が見つかりません: ${t.photoId}`);
    if (photo.spotId !== t.spotId) throw new Error(`spotIdが想定と違います: ${t.photoId}`);
    const itin = await prisma.itinerary.findUnique({ where: { id: t.itinId }, select: { title: true, thumbnailUrl: true } });
    if (!itin) throw new Error(`しおりが見つかりません: ${t.itinId}`);
    const actualIsCover = itin.thumbnailUrl === photo.url;
    if (actualIsCover !== t.isCover) throw new Error(`表紙かどうかの想定が違います: ${t.photoId} (実際: ${actualIsCover})`);
    console.log(`[確認OK] ${t.caption} (${itin.title}) | ${t.fileTitle ? "差し替え" : "削除のみ"} | ${t.reason}`);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  for (const t of TASKS) {
    const oldPhoto = await prisma.photo.findUnique({ where: { id: t.photoId } });
    if (!oldPhoto) throw new Error(`書き込み直前に写真が見つかりません: ${t.photoId}`);

    if (!t.fileTitle) {
      await prisma.photo.delete({ where: { id: t.photoId } });
      console.log(`  COMMITTED: ${t.caption} (photo ${t.photoId} -> 削除のみ)`);
      continue;
    }

    const result = await uploadCommonsFile(t.fileTitle, t.caption, BLOB_PREFIX);
    if (!result) throw new Error(`画像の取得・ライセンス確認に失敗しました(${t.fileTitle})`);
    console.log(`取得: ${result.url}`, result.credit);

    await prisma.photo.delete({ where: { id: t.photoId } });
    await prisma.photo.create({
      data: {
        spotId: t.spotId,
        url: result.url,
        caption: t.caption,
        sourceUrl: result.credit.sourceUrl ?? null,
        author: result.credit.author ?? null,
        license: result.credit.license ?? null,
        licenseUrl: result.credit.licenseUrl ?? null,
      },
    });

    if (t.isCover) {
      await prisma.itinerary.update({ where: { id: t.itinId }, data: { thumbnailUrl: result.url } });
      console.log(`  表紙も更新: ${t.itinId}`);
    }
    console.log(`  COMMITTED: ${t.caption} (photo ${t.photoId} -> 新規作成)`);
  }
}
main().finally(() => prisma.$disconnect());

/**
 * 使っていないエリア「近江八幡」(id 60c4a8cd-5e5b-4a3a-97c9-defded9194ed)の削除。
 * 2026-11-02に作成、しおりc11e9dffの登録時に一時的に使われたが、企画運営の決定で
 * しおりからは外し(unlink)、エリア本体の削除はユーザーの了承を得てから行うとされていた。
 * 2026-11-03、企画運営から、ユーザー本人の言葉「使っていない近江八幡のエリアを消して」
 * (12:26、企画運営の画面で了承済み)として伝達があったため、削除する。
 *
 * 削除前に、このareaIdを参照している行がどこにもないことを確かめる
 * (ItineraryArea・UserWishlistArea・PlannerServiceArea・UserAccount.homeAreaId・
 * PlannerAccount.homeAreaId・PrefectureVisit・ほかのAreaのparentId)。
 * 1件でもあれば削除せずに知らせる。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const AREA_ID = "60c4a8cd-5e5b-4a3a-97c9-defded9194ed";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const area = await prisma.area.findUniqueOrThrow({ where: { id: AREA_ID } });
  console.log(`対象: ${area.name} (${area.level}, parentId=${area.parentId})`);

  const [itinAreaCount, wishlistCount, serviceAreaCount, userHomeCount, plannerHomeCount, prefVisitCount, childAreaCount] =
    await Promise.all([
      prisma.itineraryArea.count({ where: { areaId: AREA_ID } }),
      prisma.userWishlistArea.count({ where: { areaId: AREA_ID } }),
      prisma.plannerServiceArea.count({ where: { areaId: AREA_ID } }),
      prisma.userAccount.count({ where: { homeAreaId: AREA_ID } }),
      prisma.plannerAccount.count({ where: { homeAreaId: AREA_ID } }),
      prisma.prefectureVisit.count({ where: { areaId: AREA_ID } }),
      prisma.area.count({ where: { parentId: AREA_ID } }),
    ]);

  console.log("\n[このareaIdを参照している件数]");
  console.log(`ItineraryArea: ${itinAreaCount}`);
  console.log(`UserWishlistArea: ${wishlistCount}`);
  console.log(`PlannerServiceArea: ${serviceAreaCount}`);
  console.log(`UserAccount.homeAreaId: ${userHomeCount}`);
  console.log(`PlannerAccount.homeAreaId: ${plannerHomeCount}`);
  console.log(`PrefectureVisit: ${prefVisitCount}`);
  console.log(`ほかのAreaのparentId: ${childAreaCount}`);

  const total = itinAreaCount + wishlistCount + serviceAreaCount + userHomeCount + plannerHomeCount + prefVisitCount + childAreaCount;
  if (total > 0) {
    console.log(`\n参照が${total}件あるため、削除しません。`);
    return;
  }
  console.log("\n参照は0件です。削除できます。");

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.area.delete({ where: { id: AREA_ID } });
  console.log("書き込みました(削除しました)。");
}
main().finally(() => prisma.$disconnect());

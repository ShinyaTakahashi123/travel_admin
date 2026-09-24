/**
 * 非公開にした以前の公式しおり（62件見込み）の削除
 * docs/specs/20260924-delete-private-itineraries.md
 *
 * 対象: 公式プランナー（OFFICIAL_PLANNER_ID）の status="private" のしおりのみ。
 * Day/Spot/Photo/ItineraryArea/ItineraryTag/ItineraryPurposeTag/Favorite/Comment/ShareLog は
 * schema.prisma上 onDelete: Cascade のため、Itineraryの削除で自動的に削除される。
 * Request.itineraryId / PageView.itineraryId は onDelete: SetNull のため、
 * 行自体は残りitineraryIdがNULLになる（Report.targetIdはFK関連なしで無関係）。
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/delete-private-seed-itineraries.ts
 *   削除モード: npx tsx prisma/delete-private-seed-itineraries.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { OFFICIAL_PLANNER_ID } from "./lib/pilot-gen";

const EXPECTED_COUNT = 62;

async function main() {
  const commit = process.argv.includes("--commit");
  console.log(commit ? "削除モードで実行します" : "確認モードで実行します（DBには書き込みません）");

  const targets = await prisma.itinerary.findMany({
    where: { plannerAccountId: OFFICIAL_PLANNER_ID, status: "private" },
    select: { id: true, title: true, nights: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  console.log(`\n対象件数: ${targets.length}件（見込み ${EXPECTED_COUNT}件）`);
  console.log("タイトル例（先頭10件）:");
  for (const t of targets.slice(0, 10)) {
    console.log(`  - ${t.title}（${t.nights}泊）`);
  }

  const targetIds = targets.map((t) => t.id);
  const [dayCount, spotCount, photoCount, favoriteCount, commentCount, shareLogCount, requestCount, pageViewCount] =
    await Promise.all([
      prisma.day.count({ where: { itineraryId: { in: targetIds } } }),
      prisma.spot.count({ where: { day: { itineraryId: { in: targetIds } } } }),
      prisma.photo.count({ where: { spot: { day: { itineraryId: { in: targetIds } } } } }),
      prisma.favorite.count({ where: { itineraryId: { in: targetIds } } }),
      prisma.comment.count({ where: { itineraryId: { in: targetIds } } }),
      prisma.shareLog.count({ where: { itineraryId: { in: targetIds } } }),
      prisma.request.count({ where: { itineraryId: { in: targetIds } } }),
      prisma.pageView.count({ where: { itineraryId: { in: targetIds } } }),
    ]);

  console.log("\n関連データ件数:");
  console.log(`  Day: ${dayCount}件 (Cascade削除)`);
  console.log(`  Spot: ${spotCount}件 (Cascade削除)`);
  console.log(`  Photo: ${photoCount}件 (Cascade削除。画像ファイル自体はCronが後で削除)`);
  console.log(`  Favorite: ${favoriteCount}件 (Cascade削除)`);
  console.log(`  Comment: ${commentCount}件 (Cascade削除)`);
  console.log(`  ShareLog: ${shareLogCount}件 (Cascade削除)`);
  console.log(`  Request: ${requestCount}件 (itineraryIdがNULLになるのみ、行は残る)`);
  console.log(`  PageView: ${pageViewCount}件 (itineraryIdがNULLになるのみ、行は残る)`);
  console.log(`  Report: FK関連なし（targetType/targetIdの緩い参照のため対象外）`);

  const publishedCountBefore = await prisma.itinerary.count({ where: { status: "published" } });
  console.log(`\n参考: 現在の公開中しおり件数: ${publishedCountBefore}件`);

  if (targets.length !== EXPECTED_COUNT) {
    console.log(`\n⚠️ 対象件数が見込み（${EXPECTED_COUNT}件）と一致しません。安全のため削除を中止します。企画運営に報告してください。`);
    return;
  }

  if (!commit) {
    console.log("\n確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
    return;
  }

  const result = await prisma.itinerary.deleteMany({ where: { id: { in: targetIds } } });
  console.log(`\n削除しました: ${result.count}件`);

  const remainingPrivate = await prisma.itinerary.count({ where: { plannerAccountId: OFFICIAL_PLANNER_ID, status: "private" } });
  const publishedCountAfter = await prisma.itinerary.count({ where: { status: "published" } });
  console.log(`削除後の公式プランナーprivate件数: ${remainingPrivate}件`);
  console.log(`削除後の公開中しおり件数: ${publishedCountAfter}件（削除前: ${publishedCountBefore}件）`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

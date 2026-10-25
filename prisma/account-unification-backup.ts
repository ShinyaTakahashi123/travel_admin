/**
 * アカウント統合の移しかえスクリプト用の、練習・やり直しのための控え(バックアップ)。
 *
 * 開発用DBでの練習を何度でも繰り返せるように、account-unification-migrate.tsを
 * 実行する前に、関係する表の中身をJSONファイルに書き出す。本番のバックアップは
 * Neonの時点復元(PITR)を使う想定(仕様書3-3節)で、これは開発用の練習専用。
 *
 * 実行方法: npx tsx prisma/account-unification-backup.ts <書き出し先のパス>
 *
 * メールアドレス・パスワードのハッシュ等は、ファイルには書き出すが
 * (復元に必要なため)、コンソールには一切表示しない(件数のみ表示)。
 *
 * account-unification-restore.tsで戻せるのは、プランナー自身のIDをそのまま
 * UserAccountの行にした分(C・D)のみ。会員側の別IDへまとめた分(A・B)を含む
 * 練習をやり直すときは、Neonの「親から作り直す」を使うこと(3-4節)。
 */
import { writeFileSync } from "fs";
import { prisma } from "../src/lib/prisma";

require("../scripts/assert-db-target.cjs");

async function main() {
  const outPath = process.argv[2];
  if (!outPath) {
    console.error("使い方: npx tsx prisma/account-unification-backup.ts <書き出し先のパス>");
    process.exit(1);
  }

  const [userAccounts, plannerAccounts, accountLinks, accountLinkReceipts, itineraries, serviceAreas, specialtyTags] =
    await Promise.all([
      prisma.userAccount.findMany(),
      prisma.plannerAccount.findMany(),
      prisma.accountLink.findMany(),
      prisma.accountLinkReceipt.findMany(),
      prisma.itinerary.findMany({ select: { id: true, plannerAccountId: true } }),
      prisma.plannerServiceArea.findMany(),
      prisma.plannerSpecialtyTag.findMany(),
    ]);

  const backup = {
    takenAt: new Date().toISOString(),
    userAccounts,
    plannerAccounts,
    accountLinks,
    accountLinkReceipts,
    itineraryOwnership: itineraries,
    plannerServiceAreas: serviceAreas,
    plannerSpecialtyTags: specialtyTags,
  };

  writeFileSync(outPath, JSON.stringify(backup, (_key, value) => (typeof value === "bigint" ? value.toString() : value), 2));

  console.log("控えを書き出しました:", outPath);
  console.log({
    userAccounts: userAccounts.length,
    plannerAccounts: plannerAccounts.length,
    accountLinks: accountLinks.length,
    accountLinkReceipts: accountLinkReceipts.length,
    itineraries: itineraries.length,
    plannerServiceAreas: serviceAreas.length,
    plannerSpecialtyTags: specialtyTags.length,
  });

  await prisma.$disconnect();
}

main();

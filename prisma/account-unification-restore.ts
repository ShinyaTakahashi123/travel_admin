/**
 * 【2026-10-25夜、練習で判明】このスクリプトはD・Cの取り消しもできない。
 * Itinerary等の外部キーがON DELETE RESTRICTでUserAccountを指しているため、
 * D・Cで作られたUserAccountの行にしおりが付け替わった(付いたままの)状態では、
 * その行自体を削除しようとするとDBそのものが拒否する(しおりを先に消さない
 * 限り削除できない)。しおりを先に消す「修正」は、まさに2026-10-25未明の事故と
 * 同じ操作になるため行わない。したがって、**D・Cを含む練習をやり直すときも、
 * A・Bと同じく3-4節のとおりNeonの「親から作り直す」が唯一の戻し方**
 * (以下の本文・実装は、この制約が分かる前に書いたもので、--commitは失敗する。
 * 読み取り専用の確認モードは、件数の目安を見るためだけに使える)
 *
 * account-unification-backup.tsで書き出した控えから、開発用DBを元に戻す試み。
 * 開発用DBでの練習をやり直すためだけのスクリプト(本番では使わない。
 * 本番はNeonの時点復元(PITR)を使う。仕様書3-5節)。
 *
 * 実行方法:
 *   npx tsx prisma/account-unification-restore.ts <控えのパス>        (確認のみ)
 *   npx tsx prisma/account-unification-restore.ts <控えのパス> --commit (失敗する。上記参照)
 */
import { readFileSync } from "fs";
import { prisma } from "../src/lib/prisma";

require("../scripts/assert-db-target.cjs");

type Backup = {
  takenAt: string;
  userAccounts: Record<string, unknown>[];
  plannerAccounts: { id: string }[];
  accountLinks: Record<string, unknown>[];
  accountLinkReceipts: Record<string, unknown>[];
  plannerServiceAreas: Record<string, unknown>[];
  plannerSpecialtyTags: Record<string, unknown>[];
};

async function main() {
  const backupPath = process.argv[2];
  const commit = process.argv.includes("--commit");
  if (!backupPath) {
    console.error("使い方: npx tsx prisma/account-unification-restore.ts <控えのパス> [--commit]");
    process.exit(1);
  }

  const backup = JSON.parse(readFileSync(backupPath, "utf8")) as Backup;
  const plannerIds = backup.plannerAccounts.map((p) => p.id);

  console.log("控えの取得時刻:", backup.takenAt);
  console.log("モード:", commit ? "実際に戻します(D・Cのみ。A・Bは戻せません)" : "確認のみ(--commitで実行)");

  // 控えに記録されたplannerAccount.idと同じidを持つUserAccountの行は、
  // D・Cの変換によって新しく作られたものだと判定できる(統合前は id空間が重ならないため)
  const createdByMigration = await prisma.userAccount.count({ where: { id: { in: plannerIds } } });
  console.log("控え後に作られたとみられるUserAccountの行:", createdByMigration);

  if (!commit) {
    await prisma.$disconnect();
    return;
  }

  await prisma.$transaction(
    async (tx) => {
      await tx.userAccount.deleteMany({ where: { id: { in: plannerIds } } });

      await tx.accountLink.deleteMany();
      await tx.accountLinkReceipt.deleteMany();
      await tx.plannerServiceArea.deleteMany({ where: { plannerAccountId: { in: plannerIds } } });
      await tx.plannerSpecialtyTag.deleteMany({ where: { plannerAccountId: { in: plannerIds } } });

      if (backup.accountLinks.length) {
        await tx.accountLink.createMany({ data: backup.accountLinks as never[] });
      }
      if (backup.accountLinkReceipts.length) {
        await tx.accountLinkReceipt.createMany({ data: backup.accountLinkReceipts as never[] });
      }
      if (backup.plannerServiceAreas.length) {
        await tx.plannerServiceArea.createMany({ data: backup.plannerServiceAreas as never[] });
      }
      if (backup.plannerSpecialtyTags.length) {
        await tx.plannerSpecialtyTag.createMany({ data: backup.plannerSpecialtyTags as never[] });
      }
    },
    { timeout: 30000 }
  );

  console.log("D・Cの変換分を戻しました。A・Bが含まれていた場合は、別途Neonの「親から作り直す」が必要です。");
  await prisma.$disconnect();
}

main();

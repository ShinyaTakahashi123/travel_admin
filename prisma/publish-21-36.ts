/**
 * チェック表 #21〜#36(16本、法✅・企✅済み)の承認待ち→公開。
 *
 * ユーザーの言葉(そのまま)「16本を今公開して」(2026-10-14 15:02、企画運営の
 * 画面。記録はdocs/decisions/relay-log.md)を受け、企画運営からidを指定して
 * 伝えられた16本だけを対象にする。本文・スポット・写真は変えない。
 *
 * 管理者サイトの承認操作(approveItinerary, src/lib/actions.ts)と同じ内容を
 * スクリプトで行う: status→published、reviewedAt→現在時刻、
 * reviewedByAdminId→管理者、rejectionReason→null、admin_audit_logに記録。
 * 対象はすべて公式プランナー(OFFICIAL_PLANNER_ID)のしおりのため、承認メールの
 * 送信対象外(通常の承認操作でもisOfficialには送らない)。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/publish-21-36.ts
 *   本登録     : npm run prod -- npx tsx prisma/publish-21-36.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const ADMIN_ID = "9d49b865-1e5c-4e79-b602-c9909feba46a";

const TARGET_PREFIXES = [
  "9a0a0270", "55e932b6", "e8927e1c", "efaee93e", "a54e45e0", "258b3878",
  "87e30105", "5429383d", "6eb0ef87", "4f3c12bd", "6ef3e7a8", "8347d735",
  "9254ab1d", "281700ca", "79fc6e71", "b9031e4f",
];

async function main() {
  console.log("[接続先チェック] host:", new URL(process.env.DATABASE_URL!).host);
  console.log(COMMIT ? "=== 本登録モード ===" : "=== 確認モード(書き込みなし) ===");

  const admin = await prisma.admin.findUnique({ where: { id: ADMIN_ID } });
  if (!admin) throw new Error("管理者アカウントが見つかりません: " + ADMIN_ID);

  const all = await prisma.itinerary.findMany({
    select: { id: true, title: true, status: true, isCopy: true, plannerAccount: { select: { isOfficial: true } } },
  });

  let okCount = 0;
  const targets: { id: string; title: string }[] = [];

  for (const prefix of TARGET_PREFIXES) {
    const matches = all.filter((a) => a.id.startsWith(prefix));
    if (matches.length !== 1) {
      console.log(`[NG] ${prefix}: ${matches.length}件一致(1件のはず)`);
      continue;
    }
    const m = matches[0];
    if (m.status !== "pending") {
      console.log(`[NG] ${prefix}(${m.title}): status=${m.status}、pendingではありません`);
      continue;
    }
    if (m.isCopy) {
      console.log(`[NG] ${prefix}(${m.title}): コピーしたしおりのため承認できません`);
      continue;
    }
    console.log(`[OK] ${prefix} -> ${m.title} (isOfficial=${m.plannerAccount.isOfficial})`);
    targets.push({ id: m.id, title: m.title });
    okCount++;
  }

  console.log(`\n見つかった(pending・対象): ${okCount} / ${TARGET_PREFIXES.length}`);
  if (okCount !== TARGET_PREFIXES.length) {
    throw new Error("16件すべてが対象どおりではありません。--commitは行いません。");
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で公開します。");

  for (const target of targets) {
    await prisma.$transaction(async (tx) => {
      await tx.itinerary.update({
        where: { id: target.id },
        data: { status: "published", reviewedAt: new Date(), reviewedByAdminId: ADMIN_ID, rejectionReason: null },
      });
      await tx.adminAuditLog.create({
        data: {
          adminId: ADMIN_ID,
          action: "approve",
          targetType: "itinerary",
          targetId: target.id,
          detail: { title: target.title, note: "ユーザー指示(2026-10-14 15:02)により16本一括公開" },
        },
      });
    });
    console.log(`  COMMITTED: ${target.title}`);
  }

  console.log("\n全16本を公開しました。");
}

main().finally(() => prisma.$disconnect());

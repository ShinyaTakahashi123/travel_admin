/**
 * 川崎大師と總持寺の初詣(a640202e、法務・内容確認1済み)の承認待ち→公開。
 *
 * ユーザーの言葉「初詣の3本を公開して」(企画運営の画面、2026-11-17 08:58ごろJST、記録: relay-log)
 * を受け、企画運営から指定されたこの1本だけを対象にする。本文・スポット・写真は変えない。
 *
 * 管理者サイトの承認操作(approveItinerary, src/lib/actions.ts)と同じ内容をスクリプトで行う:
 * status→published、reviewedAt→現在時刻、reviewedByAdminId→管理者、rejectionReason→null、
 * admin_audit_logに記録。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/publish-20261117-kawasakidaishi.ts
 *   本登録     : npm run prod -- npx tsx prisma/publish-20261117-kawasakidaishi.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const ADMIN_ID = "9d49b865-1e5c-4e79-b602-c9909feba46a";
const TARGET_ID = "a640202e-80a7-47c7-94bd-728ab553da59";

async function main() {
  console.log("[接続先チェック] host:", new URL(process.env.DATABASE_URL!).host);
  console.log(COMMIT ? "=== 本登録モード ===" : "=== 確認モード(書き込みなし) ===");

  const admin = await prisma.admin.findUnique({ where: { id: ADMIN_ID } });
  if (!admin) throw new Error("管理者アカウントが見つかりません: " + ADMIN_ID);

  const it = await prisma.itinerary.findUnique({
    where: { id: TARGET_ID },
    select: { id: true, title: true, status: true, isCopy: true, plannerAccount: { select: { isOfficial: true } } },
  });
  if (!it) throw new Error("しおりが見つかりません: " + TARGET_ID);
  if (it.status !== "pending") throw new Error(`status=${it.status}、pendingではありません`);
  if (it.isCopy) throw new Error("コピーしたしおりのため承認できません");
  console.log(`[OK] ${it.id} -> ${it.title} (status=${it.status}, isOfficial=${it.plannerAccount.isOfficial})`);

  if (!COMMIT) return console.log("\n確認モードです。--commit で公開します。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({
      where: { id: TARGET_ID },
      data: { status: "published", reviewedAt: new Date(), reviewedByAdminId: ADMIN_ID, rejectionReason: null },
    });
    await tx.adminAuditLog.create({
      data: {
        adminId: ADMIN_ID,
        action: "approve",
        targetType: "itinerary",
        targetId: TARGET_ID,
        detail: { title: it.title, note: "ユーザー指示(企画運営relay 2026-11-17 08:58ごろ)により公開" },
      },
    });
  });
  console.log(`  COMMITTED: ${it.title}`);
}

main().finally(() => prisma.$disconnect());

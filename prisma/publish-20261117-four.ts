/**
 * 第2弾の新しいしおり4本(北海道・奈良・沖縄・福岡、法✅・企✅済み)の承認待ち→公開。
 *
 * ユーザーの言葉(企画運営の画面、2026-11-17 01:50ごろJST、記録: relay-log)を受け、
 * 企画運営からidを指定して伝えられた4本だけを対象にする。本文・スポット・写真は変えない。
 *
 * 管理者サイトの承認操作(approveItinerary, src/lib/actions.ts)と同じ内容をスクリプトで行う:
 * status→published、reviewedAt→現在時刻、reviewedByAdminId→管理者、rejectionReason→null、
 * admin_audit_logに記録。対象はすべて公式プランナー(OFFICIAL_PLANNER_ID)のしおりのため、
 * 承認メールの送信対象外。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/publish-20261117-four.ts
 *   本登録     : npm run prod -- npx tsx prisma/publish-20261117-four.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const ADMIN_ID = "9d49b865-1e5c-4e79-b602-c9909feba46a";

const TARGET_IDS = [
  { id: "8c95067c-9f3a-40c7-ba71-c415c44baa03", label: "北海道" },
  { id: "b05b1752-53ae-44cb-b380-52695010f09d", label: "奈良" },
  { id: "917fe34f-f92a-4637-8c7d-a8898d2a012c", label: "沖縄" },
  { id: "82dc7b17-9451-4569-b46d-c7c9d42153b7", label: "福岡" },
];

async function main() {
  console.log("[接続先チェック] host:", new URL(process.env.DATABASE_URL!).host);
  console.log(COMMIT ? "=== 本登録モード ===" : "=== 確認モード(書き込みなし) ===");

  const admin = await prisma.admin.findUnique({ where: { id: ADMIN_ID } });
  if (!admin) throw new Error("管理者アカウントが見つかりません: " + ADMIN_ID);

  const targets: { id: string; title: string; label: string }[] = [];

  for (const t of TARGET_IDS) {
    const it = await prisma.itinerary.findUnique({
      where: { id: t.id },
      select: { id: true, title: true, status: true, isCopy: true, plannerAccount: { select: { isOfficial: true } } },
    });
    if (!it) { console.log(`[NG] ${t.label} ${t.id}: 見つかりません`); continue; }
    if (it.status !== "pending") { console.log(`[NG] ${t.label} ${t.id}(${it.title}): status=${it.status}、pendingではありません`); continue; }
    if (it.isCopy) { console.log(`[NG] ${t.label} ${t.id}(${it.title}): コピーしたしおりのため承認できません`); continue; }
    console.log(`[OK] ${t.label} ${t.id} -> ${it.title} (status=${it.status}, isOfficial=${it.plannerAccount.isOfficial})`);
    targets.push({ id: it.id, title: it.title, label: t.label });
  }

  console.log(`\n見つかった(pending・対象): ${targets.length} / ${TARGET_IDS.length}`);
  if (targets.length !== TARGET_IDS.length) {
    throw new Error("4件すべてが対象どおりではありません。--commitは行いません。");
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
          detail: { title: target.title, note: "ユーザー指示(企画運営relay 2026-11-17 01:50ごろ)により4本一括公開" },
        },
      });
    });
    console.log(`  COMMITTED: ${target.label} ${target.title}`);
  }

  console.log("\n全4本を公開しました。");
}

main().finally(() => prisma.$disconnect());

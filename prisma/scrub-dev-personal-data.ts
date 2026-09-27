// 開発用DB(Neonのdevブランチ)の個人情報を、テスト用のダミー値に置き換えるスクリプト。
//
// 実行するタイミング(仕様書 docs/specs/20260925-neon-dev-branch.md):
// - devブランチを作った直後
// - devブランチを「親から作り直した(Reset from parent)」直後
//
// 安全のしくみ: このスクリプトは、接続先が開発用として登録されたホスト名
// (.envのSHIORIE_DEV_DB_HOST)と完全に一致するときだけ動く。本番はもちろん、
// 「本番として明示された(SHIORIE_TARGET=prod)」場合であっても、このホスト名と
// 一致しない限り、例外なく止める(開発用のホスト名だけを許可するアローリスト方式。
// 本番の名前を数え上げて止める方式にすると、本番のホスト名が変わったときに
// 素通りしてしまうため採用しない。セキュリティ2026-09-27)
//
// 実行方法:
//   npx tsx prisma/scrub-dev-personal-data.ts        (確認モード。件数だけ表示)
//   npx tsx prisma/scrub-dev-personal-data.ts --commit (実際に書き換える)
//
// 置き換える内容(法務・セキュリティ2026-09-27の決定):
// - UserAccount / PlannerAccount: email(id由来のダミーへ)、google_id(null)、
//   reset_token・reset_token_expires_at(null)、password_hash(共通のダミーパスワードのハッシュへ)、
//   icon_url(null。Googleの写真のURL)
// - Admin: invite_token・reset_token(null)、password_hash(管理者用の共通ダミーパスワードの
//   ハッシュへ。本物のパスワードのハッシュが開発用DBに残ると、漏れたときに本番の管理者
//   パスワードを試す手がかりになるため。セキュリティ2026-09-27)。emailだけは、
//   運営メンバー自身が開発用の管理者サイトにログインするために置き換えない
// - Comment.ip_address、Request.ip_address、DeletedAccountRecordItem.ip_address、
//   Itinerary.submitted_ip: null
// - Request.message: 空文字("")。通信の秘密にあたるため、開発用でも中身を残さない
// - Report.reason: 開発用のダミー文へ
// - Inquiry.name / email / message: ダミーへ
// - DeletedAccountRecord.email / name、DeletedAccountRecordItem.body: ダミーへ
// - 置き換えないもの(公開している情報): UserAccount.name・profile、
//   PlannerAccount.name・profile、Comment.body、Itinerary本体、Adminのemail
// - trip・trip_spot・checkin・prefecture_visit: 会員の行動の記録のため、ダミー値への
//   置き換えではなく全件削除する(docs/specs/20260928-footprint-map-checkin.md 5節)

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const DEV_DUMMY_PASSWORD = "shiorie-dev-password";
// 管理者は最も強い権限を持つため、会員・プランナーとは別のダミーパスワードにする
// (本番のパスワードと同じ文字列は使わない。セキュリティ2026-09-27)
const DEV_DUMMY_ADMIN_PASSWORD = "shiorie-dev-admin-password";

function assertDevDbOrExit(): string {
  const dbUrl = process.env.DATABASE_URL;
  const knownDevHost = process.env.SHIORIE_DEV_DB_HOST;
  if (!dbUrl) {
    console.error("🔴 DATABASE_URLが設定されていません。");
    process.exit(1);
  }
  if (!knownDevHost) {
    console.error("🔴 .envにSHIORIE_DEV_DB_HOSTが設定されていません。開発用のDBだと確認できないため止めます。");
    process.exit(1);
  }
  const host = new URL(dbUrl).hostname;
  if (host !== knownDevHost) {
    console.error("🔴 このDBの接続先は、開発用として登録されたホスト名と一致しません。");
    console.error("   本番、または未登録の接続先に対しては、絶対にこのスクリプトを実行できません。");
    process.exit(1);
  }
  return host;
}

async function main() {
  const host = assertDevDbOrExit();
  const commit = process.argv.includes("--commit");
  console.log(`[接続先] 開発 (${host.slice(0, 15)}...)`);
  console.log(commit ? "モード: 実際に書き換えます" : "モード: 確認のみ(件数を数えます。--commitで実行)");
  console.log("");

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  const dummyPasswordHash = bcrypt.hashSync(DEV_DUMMY_PASSWORD, 10);
  const dummyAdminPasswordHash = bcrypt.hashSync(DEV_DUMMY_ADMIN_PASSWORD, 10);

  const counts = {
    userAccount: await prisma.userAccount.count(),
    plannerAccount: await prisma.plannerAccount.count(),
    admin: await prisma.admin.count({ where: { OR: [{ inviteToken: { not: null } }, { resetToken: { not: null } }] } }),
    comment: await prisma.comment.count({ where: { ipAddress: { not: null } } }),
    request: await prisma.request.count(),
    report: await prisma.report.count(),
    inquiry: await prisma.inquiry.count(),
    deletedAccountRecord: await prisma.deletedAccountRecord.count(),
    deletedAccountRecordItem: await prisma.deletedAccountRecordItem.count({
      where: { OR: [{ ipAddress: { not: null } }, { body: { not: null } }] },
    }),
    itinerarySubmittedIp: await prisma.itinerary.count({ where: { submittedIp: { not: null } } }),
    trip: await prisma.trip.count(),
    checkin: await prisma.checkin.count(),
    prefectureVisit: await prisma.prefectureVisit.count(),
  };
  console.log("対象件数:", counts);

  if (!commit) {
    await prisma.$disconnect();
    return;
  }

  await prisma.$transaction(async (tx) => {
    // UserAccount: email・google_id・reset_token・password_hash・icon_url
    await tx.$executeRaw`
      UPDATE user_account
      SET email = 'user-' || id || '@example.invalid',
          google_id = NULL,
          reset_token = NULL,
          reset_token_expires_at = NULL,
          password_hash = ${dummyPasswordHash},
          icon_url = NULL
    `;
    // PlannerAccount: 同様
    await tx.$executeRaw`
      UPDATE planner_account
      SET email = 'planner-' || id || '@example.invalid',
          google_id = NULL,
          reset_token = NULL,
          reset_token_expires_at = NULL,
          password_hash = ${dummyPasswordHash},
          icon_url = NULL
    `;
    // Admin: emailは運営メンバーが開発用の管理者サイトにログインするため置き換えない。
    // password_hashは管理者用の共通ダミーへ、招待・パスワード再設定のトークンは無効化する
    await tx.admin.updateMany({
      data: {
        passwordHash: dummyAdminPasswordHash,
        inviteToken: null,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    // IPアドレス
    await tx.comment.updateMany({ data: { ipAddress: null } });
    await tx.request.updateMany({ data: { ipAddress: null, message: "" } });
    await tx.deletedAccountRecordItem.updateMany({ data: { ipAddress: null, body: null } });
    await tx.itinerary.updateMany({ data: { submittedIp: null } });

    // 通報の理由
    await tx.report.updateMany({ data: { reason: "（開発用のダミーに置き換え済み）" } });

    // お問い合わせ
    await tx.$executeRaw`
      UPDATE inquiry
      SET name = '開発用ダミー',
          email = 'inquiry-' || id || '@example.invalid',
          message = '（開発用のダミーに置き換え済み）'
    `;

    // 退会した人の記録
    await tx.$executeRaw`
      UPDATE deleted_account_record
      SET email = 'deleted-' || id || '@example.invalid',
          name = '開発用ダミー'
    `;

    // 足あと地図・現地チェックイン: 会員の行動の記録なので全件削除する
    // (tripを消すとtrip_spot・checkinはonDelete: Cascadeで一緒に消える)
    await tx.trip.deleteMany();
    await tx.prefectureVisit.deleteMany();
  });

  console.log("");
  console.log("置き換えが完了しました。");
  console.log(`会員・プランナーは共通のダミーパスワード「${DEV_DUMMY_PASSWORD}」でログインできます。`);
  console.log(`管理者は共通のダミーパスワード「${DEV_DUMMY_ADMIN_PASSWORD}」でログインできます。`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

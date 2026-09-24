"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";
import { getActiveAdmin } from "@/lib/admin-guard";
import { ActionResult, ActionError, fail } from "@/lib/action-result";

const INVITE_EXPIRES_HOURS = 72;
const USER_SITE_URL = process.env.USER_SITE_URL ?? "https://shiorietrip.com";
const PLANNER_SITE_URL = process.env.PLANNER_SITE_URL ?? "https://planner.shiorietrip.com";

// exportされた各関数の本体をこれで包み、ActionErrorはActionResultに変換する。
// それ以外の例外(予期しないエラー)はそのままthrowし直す
async function run<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (err) {
    if (err instanceof ActionError) return { ok: false, error: err.message };
    throw err;
  }
}

async function requireAdmin() {
  const admin = await getActiveAdmin();
  if (!admin) fail("ログインが必要です");
  return admin;
}

async function requireSuperAdmin() {
  const user = await requireAdmin();
  if (user.role !== "super") fail("スーパー管理者のみ実行できます");
  return user;
}

// ============================================================
// 管理者アカウント管理
// ============================================================

export async function inviteAdmin(email: string, role: "super" | "staff"): Promise<ActionResult<{ inviteToken: string }>> {
  return run(async () => {
    await requireSuperAdmin();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) fail("メールアドレスを入力してください");

    const existing = await prisma.admin.findUnique({ where: { email: trimmedEmail } });
    if (existing) fail("このメールアドレスは既に登録されています");

    const inviteToken = crypto.randomBytes(32).toString("hex");
    const inviteExpiresAt = new Date(Date.now() + INVITE_EXPIRES_HOURS * 60 * 60 * 1000);

    await prisma.admin.create({
      data: {
        name: trimmedEmail,
        email: trimmedEmail,
        role,
        status: "invited",
        inviteToken,
        inviteExpiresAt,
      },
    });

    revalidatePath("/accounts");
    return { inviteToken };
  });
}

export async function resendInvite(adminId: string): Promise<ActionResult<{ inviteToken: string }>> {
  return run(async () => {
    await requireSuperAdmin();
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin || admin.status !== "invited") fail("招待中のアカウントのみ再送信できます");

    const inviteToken = crypto.randomBytes(32).toString("hex");
    const inviteExpiresAt = new Date(Date.now() + INVITE_EXPIRES_HOURS * 60 * 60 * 1000);
    await prisma.admin.update({ where: { id: adminId }, data: { inviteToken, inviteExpiresAt } });

    revalidatePath("/accounts");
    return { inviteToken };
  });
}

export async function updateAdminAccount({
  adminId,
  name,
  role,
}: {
  adminId: string;
  name: string;
  role: "super" | "staff";
}): Promise<ActionResult> {
  return run(async () => {
    await requireSuperAdmin();
    await prisma.admin.update({
      where: { id: adminId },
      data: { name: name.trim() || undefined, role },
    });
    revalidatePath("/accounts");
    revalidatePath(`/accounts/${adminId}/edit`);
  });
}

export async function disableAdmin(adminId: string): Promise<ActionResult> {
  return run(async () => {
    const currentUser = await requireSuperAdmin();
    if (currentUser.id === adminId) fail("自分自身は無効化できません");
    await prisma.admin.update({ where: { id: adminId }, data: { status: "disabled" } });
    revalidatePath("/accounts");
    revalidatePath(`/accounts/${adminId}/edit`);
  });
}

export async function acceptInvite({
  token,
  name,
  password,
}: {
  token: string;
  name: string;
  password: string;
}): Promise<ActionResult> {
  return run(async () => {
    const admin = await prisma.admin.findFirst({ where: { inviteToken: token } });
    if (!admin || admin.status !== "invited") {
      fail("招待リンクが無効です");
    }
    if (!admin!.inviteExpiresAt || admin!.inviteExpiresAt < new Date()) {
      fail("招待リンクの有効期限が切れています。再招待を依頼してください");
    }
    if (password.length < 8) fail("パスワードは8文字以上で入力してください");

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.admin.update({
      where: { id: admin!.id },
      data: {
        name: name.trim() || admin!.email,
        passwordHash,
        status: "active",
        inviteToken: null,
        inviteExpiresAt: null,
        passwordChangedAt: new Date(),
      },
    });
  });
}

// ============================================================
// しおり承認・モデレーション
// ============================================================

export async function approveItinerary(itineraryId: string): Promise<ActionResult> {
  return run(async () => {
    const user = await requireAdmin();
    const itinerary = await prisma.itinerary.update({
      where: { id: itineraryId },
      data: {
        status: "published",
        reviewedAt: new Date(),
        reviewedByAdminId: user.id,
        rejectionReason: null,
      },
      include: { plannerAccount: { select: { email: true, isOfficial: true } } },
    });
    revalidatePath("/itineraries");
    revalidatePath(`/itineraries/${itineraryId}`);

    // メール送信に失敗しても、承認処理自体は成功させる
    try {
      if (!itinerary.plannerAccount.isOfficial) {
        const url = `${USER_SITE_URL}/itinerary/${itinerary.id}`;
        await sendMail({
          to: itinerary.plannerAccount.email,
          subject: "【しおりえ】しおりが公開されました",
          text: [
            `「${itinerary.title}」が公開されました。`,
            "",
            "以下のURLからご確認いただけます。",
            url,
            "",
            "ぜひSNSでシェアして、多くの方に見てもらいましょう。",
            "（しおり詳細ページの共有ボタンから、X・Facebook・LINEなどにシェアできます）",
            "",
            "引き続き、しおりえをよろしくお願いいたします。",
            "",
            "---",
            "しおりえ",
            USER_SITE_URL,
            "※このメールは送信専用です。",
          ].join("\n"),
        });
      }
    } catch (err) {
      console.error("[approveItinerary] 通知メールの送信に失敗しました:", err);
    }
  });
}

export async function rejectItinerary(itineraryId: string, reason: string): Promise<ActionResult> {
  return run(async () => {
    const user = await requireAdmin();
    const trimmed = reason.trim();
    if (!trimmed) fail("却下理由を入力してください");

    const itinerary = await prisma.itinerary.update({
      where: { id: itineraryId },
      data: {
        status: "rejected",
        reviewedAt: new Date(),
        reviewedByAdminId: user.id,
        rejectionReason: trimmed,
      },
      include: { plannerAccount: { select: { email: true, isOfficial: true } } },
    });
    revalidatePath("/itineraries");
    revalidatePath(`/itineraries/${itineraryId}`);

    // メール送信に失敗しても、却下処理自体は成功させる
    try {
      if (!itinerary.plannerAccount.isOfficial) {
        const editUrl = `${PLANNER_SITE_URL}/itineraries/${itinerary.id}/edit`;
        await sendMail({
          to: itinerary.plannerAccount.email,
          subject: "【しおりえ】しおりの公開申請について",
          text: [
            `「${itinerary.title}」の公開申請について、今回は掲載を見送らせていただきました。`,
            "",
            "理由:",
            trimmed,
            "",
            "内容を修正のうえ、再度公開申請していただくことができます。",
            "以下のURLから編集画面を開けます。",
            editUrl,
            "",
            "ご不明な点があれば、お問い合わせページからご連絡ください。",
            "",
            "---",
            "しおりえ",
            PLANNER_SITE_URL,
            "※このメールは送信専用です。",
          ].join("\n"),
        });
      }
    } catch (err) {
      console.error("[rejectItinerary] 通知メールの送信に失敗しました:", err);
    }
  });
}

export async function hideItinerary(itineraryId: string): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    await prisma.itinerary.update({ where: { id: itineraryId }, data: { status: "private" } });
    revalidatePath("/itineraries");
    revalidatePath(`/itineraries/${itineraryId}`);
    revalidatePath("/reports");
  });
}

export async function deleteItineraryAsAdmin(itineraryId: string): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    await prisma.itinerary.update({ where: { id: itineraryId }, data: { status: "deleted" } });
    revalidatePath("/itineraries");
    revalidatePath(`/itineraries/${itineraryId}`);
  });
}

// ============================================================
// ユーザー・プランナーアカウント管理
// ============================================================

export async function setUserAccountStatus(
  userAccountId: string,
  status: "active" | "suspended"
): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    await prisma.userAccount.update({ where: { id: userAccountId }, data: { status } });
    revalidatePath("/users");
    revalidatePath(`/users/${userAccountId}`);
  });
}

// 手続き中(権利侵害の申告・開示請求の対応中など)の保全の印。スーパー管理者のみ付け外しできる
export async function setUserAccountLegalHold(userAccountId: string, legalHold: boolean): Promise<ActionResult> {
  return run(async () => {
    await requireSuperAdmin();
    await prisma.userAccount.update({ where: { id: userAccountId }, data: { legalHold } });
    revalidatePath(`/users/${userAccountId}`);
  });
}

// 削除前6か月以内の投稿・送信を、退会後の保存記録(DeletedAccountRecord)に移してから削除する
// (利用者本人が画面から退会する場合と同じ扱い。user-site の deleteMyAccount と対応)
export async function deleteUserAccount(userAccountId: string): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    const account = await prisma.userAccount.findUniqueOrThrow({ where: { id: userAccountId } });

    const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
    const [comments, requests] = await Promise.all([
      prisma.comment.findMany({
        where: { userAccountId, createdAt: { gte: sixMonthsAgo } },
        select: { body: true, ipAddress: true, createdAt: true },
      }),
      prisma.request.findMany({
        where: { senderUserAccountId: userAccountId, createdAt: { gte: sixMonthsAgo } },
        select: { ipAddress: true, createdAt: true },
      }),
    ]);

    await prisma.$transaction([
      prisma.deletedAccountRecord.create({
        data: {
          accountType: "user",
          originalAccountId: account.id,
          email: account.email,
          name: account.name,
          legalHold: account.legalHold,
          items: {
            create: [
              ...comments.map((c) => ({
                kind: "comment",
                body: c.body,
                ipAddress: c.ipAddress,
                occurredAt: c.createdAt,
              })),
              // リクエストは通信の秘密のため本文は移さない
              ...requests.map((r) => ({
                kind: "request",
                body: null,
                ipAddress: r.ipAddress,
                occurredAt: r.createdAt,
              })),
            ],
          },
        },
      }),
      prisma.userAccount.delete({ where: { id: userAccountId } }),
    ]);
    revalidatePath("/users");
  });
}

export async function setPlannerAccountStatus(
  plannerAccountId: string,
  status: "active" | "suspended"
): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    const account = await prisma.plannerAccount.findUniqueOrThrow({ where: { id: plannerAccountId } });
    // 公式プランナー(公式しおりの投稿元)は操作ミスによる利用停止を防ぐため対象外
    if (account.isOfficial) fail("公式プランナーアカウントは操作できません");
    await prisma.plannerAccount.update({ where: { id: plannerAccountId }, data: { status } });
    revalidatePath("/planners");
    revalidatePath(`/planners/${plannerAccountId}`);
  });
}

// 手続き中(権利侵害の申告・開示請求の対応中など)の保全の印。スーパー管理者のみ付け外しできる
export async function setPlannerAccountLegalHold(plannerAccountId: string, legalHold: boolean): Promise<ActionResult> {
  return run(async () => {
    await requireSuperAdmin();
    await prisma.plannerAccount.update({ where: { id: plannerAccountId }, data: { legalHold } });
    revalidatePath(`/planners/${plannerAccountId}`);
  });
}

// 削除前6か月以内のしおり公開申請(タイトルのみ)を、退会後の保存記録(DeletedAccountRecord)に
// 移してから削除する(プランナー本人が画面から退会する場合と同じ扱い)
export async function deletePlannerAccount(plannerAccountId: string): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    const account = await prisma.plannerAccount.findUniqueOrThrow({ where: { id: plannerAccountId } });

    // 公式プランナー(公式しおりの投稿元)は操作ミス1回で公式しおりが全て消えるため、削除の対象外
    if (account.isOfficial) fail("公式プランナーアカウントは削除できません");

    const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
    const submissions = await prisma.itinerary.findMany({
      where: { plannerAccountId, submittedAt: { gte: sixMonthsAgo }, submittedIp: { not: null } },
      select: { title: true, submittedIp: true, submittedAt: true },
    });

    await prisma.$transaction([
      prisma.deletedAccountRecord.create({
        data: {
          accountType: "planner",
          originalAccountId: account.id,
          email: account.email,
          name: account.name,
          legalHold: account.legalHold,
          items: {
            create: submissions.map((s) => ({
              kind: "itinerary_submission",
              body: s.title,
              ipAddress: s.submittedIp,
              occurredAt: s.submittedAt as Date,
            })),
          },
        },
      }),
      prisma.plannerAccount.delete({ where: { id: plannerAccountId } }),
    ]);
    revalidatePath("/planners");
  });
}

// ============================================================
// 通報管理
// ============================================================

export async function resolveReportHideItinerary(reportId: string): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    const report = await prisma.report.findUniqueOrThrow({ where: { id: reportId } });
    if (report.targetType === "itinerary") {
      await prisma.itinerary.update({ where: { id: report.targetId }, data: { status: "private" } });
    }
    await prisma.report.update({ where: { id: reportId }, data: { status: "resolved" } });
    revalidatePath("/reports");
    revalidatePath("/itineraries");
  });
}

export async function dismissReport(reportId: string): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    await prisma.report.update({ where: { id: reportId }, data: { status: "dismissed" } });
    revalidatePath("/reports");
  });
}

// ============================================================
// お問い合わせ管理
// ============================================================

export async function markInquiryRead(inquiryId: string): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    const inquiry = await prisma.inquiry.findUnique({ where: { id: inquiryId } });
    if (inquiry?.status === "unread") {
      await prisma.inquiry.update({ where: { id: inquiryId }, data: { status: "read" } });
      revalidatePath("/inquiries");
    }
  });
}

export async function markInquiryResponded(inquiryId: string): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    await prisma.inquiry.update({ where: { id: inquiryId }, data: { status: "responded" } });
    revalidatePath("/inquiries");
  });
}

export async function markInquiryUnresponded(inquiryId: string): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    await prisma.inquiry.update({ where: { id: inquiryId }, data: { status: "read" } });
    revalidatePath("/inquiries");
  });
}

// ============================================================
// マスタ管理（エリア・タグ）
// ============================================================

export async function createPrefecture(name: string): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    const trimmed = name.trim();
    if (!trimmed) fail("都道府県名を入力してください");
    const maxOrder = await prisma.area.aggregate({
      where: { level: "prefecture" },
      _max: { displayOrder: true },
    });
    await prisma.area.create({
      data: { name: trimmed, level: "prefecture", displayOrder: (maxOrder._max.displayOrder ?? 0) + 1 },
    });
    revalidatePath("/master");
  });
}

export async function createArea(parentId: string, name: string): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    const trimmed = name.trim();
    if (!trimmed) fail("エリア名を入力してください");
    const maxOrder = await prisma.area.aggregate({
      where: { parentId },
      _max: { displayOrder: true },
    });
    await prisma.area.create({
      data: {
        name: trimmed,
        level: "area",
        parentId,
        displayOrder: (maxOrder._max.displayOrder ?? 0) + 1,
      },
    });
    revalidatePath("/master");
  });
}

export async function createTag(name: string): Promise<ActionResult> {
  return run(async () => {
    await requireAdmin();
    const trimmed = name.trim();
    if (!trimmed) fail("タグ名を入力してください");
    const existing = await prisma.tag.findUnique({ where: { name: trimmed } });
    if (existing) fail("同名のタグが既に存在します");
    await prisma.tag.create({ data: { name: trimmed } });
    revalidatePath("/master");
  });
}

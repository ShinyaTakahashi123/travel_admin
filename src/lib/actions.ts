"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const INVITE_EXPIRES_HOURS = 72;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("ログインが必要です");
  return session.user;
}

async function requireSuperAdmin() {
  const user = await requireAdmin();
  if (user.role !== "super") throw new Error("スーパー管理者のみ実行できます");
  return user;
}

// ============================================================
// 管理者アカウント管理
// ============================================================

export async function inviteAdmin(email: string, role: "super" | "staff") {
  await requireSuperAdmin();
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail) throw new Error("メールアドレスを入力してください");

  const existing = await prisma.admin.findUnique({ where: { email: trimmedEmail } });
  if (existing) throw new Error("このメールアドレスは既に登録されています");

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
}

export async function resendInvite(adminId: string) {
  await requireSuperAdmin();
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin || admin.status !== "invited") throw new Error("招待中のアカウントのみ再送信できます");

  const inviteToken = crypto.randomBytes(32).toString("hex");
  const inviteExpiresAt = new Date(Date.now() + INVITE_EXPIRES_HOURS * 60 * 60 * 1000);
  await prisma.admin.update({ where: { id: adminId }, data: { inviteToken, inviteExpiresAt } });

  revalidatePath("/accounts");
  return { inviteToken };
}

export async function updateAdminAccount({
  adminId,
  name,
  role,
}: {
  adminId: string;
  name: string;
  role: "super" | "staff";
}) {
  await requireSuperAdmin();
  await prisma.admin.update({
    where: { id: adminId },
    data: { name: name.trim() || undefined, role },
  });
  revalidatePath("/accounts");
  revalidatePath(`/accounts/${adminId}/edit`);
}

export async function disableAdmin(adminId: string) {
  const currentUser = await requireSuperAdmin();
  if (currentUser.id === adminId) throw new Error("自分自身は無効化できません");
  await prisma.admin.update({ where: { id: adminId }, data: { status: "disabled" } });
  revalidatePath("/accounts");
  revalidatePath(`/accounts/${adminId}/edit`);
}

export async function acceptInvite({
  token,
  name,
  password,
}: {
  token: string;
  name: string;
  password: string;
}) {
  const admin = await prisma.admin.findFirst({ where: { inviteToken: token } });
  if (!admin || admin.status !== "invited") {
    throw new Error("招待リンクが無効です");
  }
  if (!admin.inviteExpiresAt || admin.inviteExpiresAt < new Date()) {
    throw new Error("招待リンクの有効期限が切れています。再招待を依頼してください");
  }
  if (password.length < 8) throw new Error("パスワードは8文字以上で入力してください");

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      name: name.trim() || admin.email,
      passwordHash,
      status: "active",
      inviteToken: null,
      inviteExpiresAt: null,
    },
  });
}

// ============================================================
// しおり承認・モデレーション
// ============================================================

export async function approveItinerary(itineraryId: string) {
  const user = await requireAdmin();
  await prisma.itinerary.update({
    where: { id: itineraryId },
    data: {
      status: "published",
      reviewedAt: new Date(),
      reviewedByAdminId: user.id,
      rejectionReason: null,
    },
  });
  revalidatePath("/itineraries");
  revalidatePath(`/itineraries/${itineraryId}`);
}

export async function rejectItinerary(itineraryId: string, reason: string) {
  const user = await requireAdmin();
  const trimmed = reason.trim();
  if (!trimmed) throw new Error("却下理由を入力してください");

  await prisma.itinerary.update({
    where: { id: itineraryId },
    data: {
      status: "rejected",
      reviewedAt: new Date(),
      reviewedByAdminId: user.id,
      rejectionReason: trimmed,
    },
  });
  revalidatePath("/itineraries");
  revalidatePath(`/itineraries/${itineraryId}`);
}

export async function hideItinerary(itineraryId: string) {
  await requireAdmin();
  await prisma.itinerary.update({ where: { id: itineraryId }, data: { status: "private" } });
  revalidatePath("/itineraries");
  revalidatePath(`/itineraries/${itineraryId}`);
  revalidatePath("/reports");
}

export async function deleteItineraryAsAdmin(itineraryId: string) {
  await requireAdmin();
  await prisma.itinerary.update({ where: { id: itineraryId }, data: { status: "deleted" } });
  revalidatePath("/itineraries");
  revalidatePath(`/itineraries/${itineraryId}`);
}

// ============================================================
// ユーザー・プランナーアカウント管理
// ============================================================

export async function setUserAccountStatus(userAccountId: string, status: "active" | "suspended") {
  await requireAdmin();
  await prisma.userAccount.update({ where: { id: userAccountId }, data: { status } });
  revalidatePath("/users");
  revalidatePath(`/users/${userAccountId}`);
}

export async function deleteUserAccount(userAccountId: string) {
  await requireAdmin();
  await prisma.userAccount.delete({ where: { id: userAccountId } });
  revalidatePath("/users");
}

export async function setPlannerAccountStatus(
  plannerAccountId: string,
  status: "active" | "suspended"
) {
  await requireAdmin();
  await prisma.plannerAccount.update({ where: { id: plannerAccountId }, data: { status } });
  revalidatePath("/planners");
  revalidatePath(`/planners/${plannerAccountId}`);
}

export async function deletePlannerAccount(plannerAccountId: string) {
  await requireAdmin();
  await prisma.plannerAccount.delete({ where: { id: plannerAccountId } });
  revalidatePath("/planners");
}

// ============================================================
// 通報管理
// ============================================================

export async function resolveReportHideItinerary(reportId: string) {
  await requireAdmin();
  const report = await prisma.report.findUniqueOrThrow({ where: { id: reportId } });
  if (report.targetType === "itinerary") {
    await prisma.itinerary.update({ where: { id: report.targetId }, data: { status: "private" } });
  }
  await prisma.report.update({ where: { id: reportId }, data: { status: "resolved" } });
  revalidatePath("/reports");
  revalidatePath("/itineraries");
}

export async function dismissReport(reportId: string) {
  await requireAdmin();
  await prisma.report.update({ where: { id: reportId }, data: { status: "dismissed" } });
  revalidatePath("/reports");
}

// ============================================================
// マスタ管理（エリア・タグ）
// ============================================================

export async function createPrefecture(name: string) {
  await requireAdmin();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("都道府県名を入力してください");
  const maxOrder = await prisma.area.aggregate({
    where: { level: "prefecture" },
    _max: { displayOrder: true },
  });
  await prisma.area.create({
    data: { name: trimmed, level: "prefecture", displayOrder: (maxOrder._max.displayOrder ?? 0) + 1 },
  });
  revalidatePath("/master");
}

export async function createArea(parentId: string, name: string) {
  await requireAdmin();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("エリア名を入力してください");
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
}

export async function createTag(name: string) {
  await requireAdmin();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("タグ名を入力してください");
  const existing = await prisma.tag.findUnique({ where: { name: trimmed } });
  if (existing) throw new Error("同名のタグが既に存在します");
  await prisma.tag.create({ data: { name: trimmed } });
  revalidatePath("/master");
}

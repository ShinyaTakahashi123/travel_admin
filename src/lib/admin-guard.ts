import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ActiveAdmin = { id: string; name: string; email: string; role: string };

// ログイン中のセッションに対応するAdminをDBから読み、有効(active)であることを
// 確認する。ロールもJWTの値ではなくDBの最新の値を使う。利用停止・無効化・
// 権限変更を、再ログインを待たずログイン中の人にもすぐ効かせるための共通関数
export async function getActiveAdmin(): Promise<ActiveAdmin | null> {
  const session = await auth();
  const adminId = session?.user?.id;
  if (!adminId) return null;

  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin || admin.status !== "active") return null;

  return { id: admin.id, name: admin.name, email: admin.email, role: admin.role };
}

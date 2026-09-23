import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime, ADMIN_STATUS_LABEL } from "@/lib/format";
import { InviteAdminDialog } from "@/components/invite-admin-dialog";
import { ResendInviteButton } from "@/components/resend-invite-button";

const ROLE_LABEL: Record<string, { label: string; bg: string; fg: string }> = {
  super: { label: "スーパー管理者", bg: "#EEF0FF", fg: "#4F46E5" },
  staff: { label: "一般管理者", bg: "#F1F5F9", fg: "#64748B" },
};

export default async function AccountManagementPage() {
  const session = await auth();
  if (session?.user.role !== "super") redirect("/");

  const admins = await prisma.admin.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <h1 className="text-xl font-black">アカウント管理</h1>
        <InviteAdminDialog />
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        管理者サイトにログインできるアカウントを管理します。自己登録はできず、ここから招待されたアカウントのみログイン可能です。
      </p>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["名前", "メールアドレス", "権限", "最終ログイン", "ステータス", ""].map((h) => (
                <th key={h} className="text-left text-sm text-muted-foreground font-bold px-3.5 pb-2.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => {
              const role = ROLE_LABEL[admin.role];
              const status = ADMIN_STATUS_LABEL[admin.status];
              const isExpiringInvite = admin.status === "invited";
              const daysLeft =
                isExpiringInvite && admin.inviteExpiresAt
                  ? Math.max(0, Math.ceil((admin.inviteExpiresAt.getTime() - new Date().getTime()) / 86400000))
                  : null;
              return (
                <tr key={admin.id} className="border-t border-muted">
                  <td className="text-base px-3.5 py-3">{admin.name}</td>
                  <td className="text-base px-3.5 py-3">{admin.email}</td>
                  <td className="px-3.5 py-3">
                    <span
                      className="text-sm font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: role.bg, color: role.fg }}
                    >
                      {role.label}
                    </span>
                  </td>
                  <td className="text-base px-3.5 py-3">
                    {admin.status === "active" && admin.updatedAt ? formatDateTime(admin.updatedAt) : "—"}
                  </td>
                  <td className="px-3.5 py-3">
                    <span
                      className="text-sm font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: status.bg, color: status.fg }}
                    >
                      {status.label}
                      {daysLeft !== null && `（残り${daysLeft}日）`}
                    </span>
                  </td>
                  <td className="px-3.5 py-3">
                    {admin.status === "invited" ? (
                      <ResendInviteButton adminId={admin.id} />
                    ) : (
                      <Link href={`/accounts/${admin.id}/edit`} className="text-sm font-bold text-primary">
                        編集
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

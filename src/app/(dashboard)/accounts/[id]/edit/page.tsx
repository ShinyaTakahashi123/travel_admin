import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatDateTime, ADMIN_STATUS_LABEL } from "@/lib/format";
import { AccountEditForm } from "@/components/account-edit-form";

export default async function AccountEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (session?.user.role !== "super") redirect("/");

  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin) notFound();

  const status = ADMIN_STATUS_LABEL[admin.status];

  return (
    <div>
      <div className="text-sm text-muted-foreground mb-2">
        <Link href="/accounts">アカウント管理</Link> &gt;{" "}
        <span className="text-foreground font-bold">{admin.name}</span>
      </div>
      <h1 className="text-xl font-black mb-5">管理者アカウントの編集</h1>

      <div className="max-w-[640px] bg-card border border-border rounded-2xl p-6.5 flex flex-col gap-4.5">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-black text-2xl">
            {admin.name.charAt(0)}
          </div>
          <div>
            <div className="font-black text-lg">{admin.name}</div>
            <div className="text-sm text-muted-foreground">
              最終ログイン: {admin.status === "active" ? formatDateTime(admin.updatedAt) : "—"}
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-bold text-muted-foreground mb-1.5">メールアドレス</div>
          <div className="border border-input rounded-lg px-3 py-2.5 text-base bg-muted text-muted-foreground">
            {admin.email}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            メールアドレスの変更はできません（変更する場合は無効化のうえ再招待してください）
          </div>
        </div>

        <div>
          <div className="text-sm font-bold text-muted-foreground mb-1.5">ステータス</div>
          <div className="flex items-center gap-2.5">
            <span
              className="text-sm font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: status.bg, color: status.fg }}
            >
              {status.label}
            </span>
            <span className="text-sm text-muted-foreground">
              作成日: {formatDate(admin.createdAt)}
            </span>
          </div>
        </div>

        <AccountEditForm
          adminId={admin.id}
          initialName={admin.name}
          initialRole={admin.role as "super" | "staff"}
          isSelf={session.user.id === admin.id}
          disabled={admin.status === "disabled"}
        />
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { AcceptInviteForm } from "@/components/accept-invite-form";

export default async function AdminInviteAcceptPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const admin = await prisma.admin.findFirst({ where: { inviteToken: token } });

  const invalid = !admin || admin.status !== "invited";
  const expired = admin?.inviteExpiresAt ? admin.inviteExpiresAt < new Date() : false;

  return (
    <div className="flex-1 flex items-center justify-center px-5 py-16 bg-[#0F172A]">
      <div className="w-full max-w-[420px]">
        <div className="flex flex-col items-center gap-2.5 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl">
            旅
          </div>
          <div className="text-white font-black text-[17px]">旅しおり 管理者サイト</div>
        </div>

        <div className="bg-white rounded-[18px] p-8 px-7.5">
          {invalid || expired ? (
            <>
              <div className="font-black text-[15px] mb-1">招待リンクが無効です</div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {expired
                  ? "この招待リンクの有効期限が切れています。システム管理者に再招待を依頼してください。"
                  : "この招待リンクは既に使用されているか、存在しません。"}
              </p>
            </>
          ) : (
            <>
              <div className="font-black text-[15px] mb-1">管理者アカウントの設定</div>
              <p className="text-[11px] text-muted-foreground mb-5.5 leading-relaxed">
                管理者への招待が届いています。名前とパスワードを設定してアカウントを有効化してください。
              </p>
              <AcceptInviteForm
                token={token}
                email={admin.email}
                roleLabel={admin.role === "super" ? "スーパー管理者" : "一般管理者"}
              />
              {admin.inviteExpiresAt && (
                <div className="text-center text-[11px] text-muted-foreground mt-5">
                  この招待リンクの有効期限: {formatDateTime(admin.inviteExpiresAt)} まで
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

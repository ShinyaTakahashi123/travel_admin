"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { inviteAdmin } from "@/lib/actions";
import { UNEXPECTED_ERROR_MESSAGE } from "@/lib/action-result";

export function InviteAdminDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"staff" | "super">("staff");
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const result = await inviteAdmin(email, role);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setInviteLink(`${window.location.origin}/invite/accept/${result.data.inviteToken}`);
        router.refresh();
      } catch {
        setError(UNEXPECTED_ERROR_MESSAGE);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setEmail("");
          setRole("staff");
          setInviteLink(null);
          setError(null);
        }
      }}
    >
      <DialogTrigger className="flex items-center gap-2 bg-primary text-white rounded-lg px-4.5 py-2.5 font-bold text-base">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
          <path d="M12 5v14M5 12h14" />
        </svg>
        管理者を招待
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>管理者を招待</DialogTitle>
          <DialogDescription>
            招待リンクを発行します。受信者自身が名前とパスワードを設定してアカウントを有効化します
          </DialogDescription>
        </DialogHeader>

        {inviteLink ? (
          <div className="flex flex-col gap-3">
            <p className="text-base">
              招待を作成しました。下記のリンクを{email}さんに直接共有してください
              （メール送信機能は未実装のため、リンクの送付は手動で行ってください）。
            </p>
            <div className="bg-muted rounded-lg px-3 py-2.5 text-sm break-all select-all">
              {inviteLink}
            </div>
            <p className="text-sm text-muted-foreground">
              このリンクの有効期限は発行から72時間です。
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <div className="text-sm font-bold text-muted-foreground mb-1.5">
                招待するメールアドレス
              </div>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2.5 text-base"
              />
            </div>

            <div>
              <div className="text-sm font-bold text-muted-foreground mb-1.5">権限</div>
              <div className="flex gap-2.5">
                {(
                  [
                    { value: "staff", title: "一般管理者", desc: "日常のモデレーション業務が行える権限" },
                    { value: "super", title: "スーパー管理者", desc: "アカウント管理を含む全機能が行える権限" },
                  ] as const
                ).map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setRole(opt.value)}
                    className={`flex-1 text-left border-2 rounded-lg p-3 ${
                      role === opt.value ? "border-primary bg-secondary" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          role === opt.value ? "border-primary" : "border-[#CBD5E1]"
                        }`}
                      >
                        {role === opt.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <span className="font-bold text-base">{opt.title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground ml-6">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-muted rounded-lg px-3.5 py-3 text-sm text-muted-foreground leading-relaxed">
              招待リンクの有効期限は<b>発行から72時間</b>です。期限切れの場合はアカウント管理の一覧から再発行できます。
            </div>

            {error && <div className="text-sm text-red-600 font-bold">{error}</div>}

            <DialogFooter>
              <button
                type="submit"
                disabled={isPending}
                className="bg-primary text-white rounded-lg px-5.5 py-2.5 font-bold text-base disabled:opacity-50"
              >
                招待を作成
              </button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

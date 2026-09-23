"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateAdminAccount, disableAdmin } from "@/lib/actions";

export function AccountEditForm({
  adminId,
  initialName,
  initialRole,
  isSelf,
  disabled,
}: {
  adminId: string;
  initialName: string;
  initialRole: "super" | "staff";
  isSelf: boolean;
  disabled: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [role, setRole] = useState<"super" | "staff">(initialRole);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await updateAdminAccount({ adminId, name, role });
      router.push("/accounts");
    });
  }

  function handleDisable() {
    if (!confirm("このアカウントを無効化しますか？")) return;
    startTransition(async () => {
      await disableAdmin(adminId);
      router.push("/accounts");
    });
  }

  return (
    <>
      <div>
        <div className="text-sm font-bold text-muted-foreground mb-1.5">名前</div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-input rounded-lg px-3 py-2.5 text-base"
        />
      </div>

      <div>
        <div className="text-sm font-bold text-muted-foreground mb-1.5">権限</div>
        <div className="flex gap-2.5">
          {(
            [
              { value: "staff", title: "一般管理者" },
              { value: "super", title: "スーパー管理者" },
            ] as const
          ).map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => setRole(opt.value)}
              disabled={isSelf}
              className={`flex-1 border rounded-lg p-3 disabled:opacity-60 ${
                role === opt.value ? "border-primary" : "border-border"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                    role === opt.value ? "border-primary" : "border-[#CBD5E1]"
                  }`}
                >
                  {role === opt.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <span className="font-bold text-base">{opt.title}</span>
              </div>
            </button>
          ))}
        </div>
        {isSelf && (
          <p className="text-xs text-muted-foreground mt-1.5">自分自身の権限は変更できません</p>
        )}
      </div>

      <div className="h-px bg-muted my-1" />

      <div className="flex justify-between items-center">
        {!isSelf && !disabled ? (
          <button
            onClick={handleDisable}
            disabled={isPending}
            className="bg-white border border-red-300 text-red-600 rounded-lg px-4.5 py-2.5 font-bold text-sm disabled:opacity-50"
          >
            このアカウントを無効化する
          </button>
        ) : (
          <span />
        )}
        <div className="flex gap-2.5">
          <button
            onClick={() => router.push("/accounts")}
            className="bg-white border border-border rounded-lg px-5 py-2.5 font-bold text-base"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="bg-primary text-white rounded-lg px-5.5 py-2.5 font-bold text-base disabled:opacity-50"
          >
            保存する
          </button>
        </div>
      </div>
    </>
  );
}

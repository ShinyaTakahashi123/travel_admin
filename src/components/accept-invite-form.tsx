"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { acceptInvite } from "@/lib/actions";

export function AcceptInviteForm({
  token,
  email,
  roleLabel,
}: {
  token: string;
  email: string;
  roleLabel: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }
    setLoading(true);
    try {
      await acceptInvite({ token, name, password });
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "設定に失敗しました");
      return;
    }
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("アカウントは有効化されましたが、自動ログインに失敗しました。ログイン画面からログインしてください");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <div>
        <div className="text-sm font-bold text-[#64748B] mb-1.5">メールアドレス</div>
        <div className="border border-input rounded-[10px] px-3.5 py-3 text-base bg-muted text-muted-foreground">
          {email}
        </div>
      </div>
      <div>
        <div className="text-sm font-bold text-[#64748B] mb-1.5">権限</div>
        <div className="border border-input rounded-[10px] px-3.5 py-3 text-base bg-muted text-muted-foreground">
          {roleLabel}
        </div>
      </div>
      <div>
        <div className="text-sm font-bold text-[#64748B] mb-1.5">名前</div>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: 運営 花子"
          className="w-full border border-input rounded-[10px] px-3.5 py-3 text-base"
        />
      </div>
      <div>
        <div className="text-sm font-bold text-[#64748B] mb-1.5">パスワード</div>
        <input
          required
          type="password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="8文字以上"
          className="w-full border border-input rounded-[10px] px-3.5 py-3 text-base"
        />
      </div>
      <div>
        <div className="text-sm font-bold text-[#64748B] mb-1.5">パスワード（確認）</div>
        <input
          required
          type="password"
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="もう一度入力してください"
          className="w-full border border-input rounded-[10px] px-3.5 py-3 text-base"
        />
      </div>

      {error && <div className="text-sm text-red-600 font-bold">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white rounded-[10px] py-3.5 font-black text-base mt-1 disabled:opacity-60"
      >
        アカウントを有効化する
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("メールアドレスまたはパスワードが正しくないか、このアカウントは無効です");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <div>
        <div className="text-sm font-bold text-[#64748B] mb-1.5">管理者メールアドレス</div>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-input rounded-[10px] px-3.5 py-3 text-base"
          placeholder="admin@tabi-shiori.example"
        />
      </div>
      <div>
        <div className="text-sm font-bold text-[#64748B] mb-1.5">パスワード</div>
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-input rounded-[10px] px-3.5 py-3 text-base"
          placeholder="••••••••"
        />
      </div>

      {error && <div className="text-sm text-red-600 font-bold">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white rounded-[10px] py-3.5 font-black text-base mt-1 disabled:opacity-60"
      >
        ログイン
      </button>
    </form>
  );
}

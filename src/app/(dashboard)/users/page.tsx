import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, ACCOUNT_STATUS_LABEL } from "@/lib/format";

export default async function UserManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; q?: string }>;
}) {
  const { plan, q } = await searchParams;

  const users = await prisma.userAccount.findMany({
    where: q
      ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: { subscription: true, _count: { select: { favorites: true } } },
  });

  const filtered =
    plan === "premium"
      ? users.filter((u) => u.subscription?.plan === "premium")
      : plan === "free"
        ? users.filter((u) => u.subscription?.plan !== "premium")
        : users;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <h1 className="text-xl font-black">ユーザー一覧</h1>
        <form action="/users" className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            name="q"
            defaultValue={q}
            placeholder="ユーザーを検索"
            className="text-sm outline-none placeholder:text-muted-foreground"
          />
        </form>
      </div>
      <p className="text-sm text-muted-foreground mb-3.5">
        ユーザーサイトのアカウント一覧です（しおりを投稿するプランナーサイトのアカウントとは別管理です）。
      </p>

      <div className="flex gap-2.5 mb-3.5">
        {[
          { key: undefined, label: "すべて" },
          { key: "free", label: "一般会員" },
          { key: "premium", label: "プレミアム会員" },
        ].map((opt) => (
          <Link
            key={opt.label}
            href={opt.key ? `/users?plan=${opt.key}` : "/users"}
            className={`text-sm font-bold px-4 py-1.5 rounded-full border ${
              (plan ?? undefined) === opt.key
                ? "bg-secondary border-[#C7CBFA] text-secondary-foreground"
                : "bg-white border-border text-foreground"
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["ID", "名前", "メールアドレス", "登録日", "お気に入り数", "会員種別", "ステータス", ""].map((h) => (
                <th key={h} className="text-left text-sm text-muted-foreground font-bold px-3.5 pb-2.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => {
              const isPremium = user.subscription?.plan === "premium";
              const status = ACCOUNT_STATUS_LABEL[user.status];
              return (
                <tr key={user.id} className="border-t border-muted">
                  <td className="text-base px-3.5 py-3">U-{user.id.slice(0, 4).toUpperCase()}</td>
                  <td className="text-base px-3.5 py-3">{user.name}</td>
                  <td className="text-base px-3.5 py-3">{user.email}</td>
                  <td className="text-base px-3.5 py-3">{formatDate(user.createdAt)}</td>
                  <td className="text-base px-3.5 py-3">{user._count.favorites}</td>
                  <td className="px-3.5 py-3">
                    <span
                      className="text-sm font-bold px-2.5 py-0.5 rounded-full"
                      style={
                        isPremium
                          ? { background: "#FFF1E0", color: "#C98A2E" }
                          : { background: "#F1F5F9", color: "#64748B" }
                      }
                    >
                      {isPremium ? "プレミアム会員" : "一般会員"}
                    </span>
                  </td>
                  <td className="px-3.5 py-3">
                    <span
                      className="text-sm font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: status.bg, color: status.fg }}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-3.5 py-3">
                    <Link href={`/users/${user.id}`} className="text-sm font-bold text-primary">
                      詳細
                    </Link>
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

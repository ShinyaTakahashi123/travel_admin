import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, ACCOUNT_STATUS_LABEL } from "@/lib/format";
import { UserAccountActions } from "@/components/user-account-actions";

export default async function UserAccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.userAccount.findUnique({
    where: { id },
    include: {
      subscription: true,
      homeArea: true,
      interestTags: { include: { tag: true } },
      wishlistAreas: { include: { area: true } },
      _count: { select: { favorites: true, comments: true, sentRequests: true } },
      favorites: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { itinerary: { select: { title: true } } },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { itinerary: { select: { title: true } } },
      },
    },
  });
  if (!user) notFound();

  const isPremium = user.subscription?.plan === "premium";
  const status = ACCOUNT_STATUS_LABEL[user.status];

  const activity = [
    ...user.favorites.map((f) => ({
      text: `「${f.itinerary.title}」をお気に入り登録`,
      date: f.createdAt,
    })),
    ...user.comments.map((c) => ({
      text: `「${c.itinerary.title}」にコメント`,
      date: c.createdAt,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6);

  return (
    <div>
      <div className="text-xs text-muted-foreground mb-2">
        <Link href="/users">ユーザー一覧</Link> &gt; <span className="text-foreground font-bold">{user.name}</span>
      </div>

      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full bg-[#D6EEFB] flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="font-black text-lg">{user.name}</div>
              <span
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                style={
                  isPremium ? { background: "#FFF1E0", color: "#C98A2E" } : { background: "#F1F5F9", color: "#64748B" }
                }
              >
                {isPremium ? "プレミアム会員" : "一般会員"}
              </span>
              <span
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                style={{ background: status.bg, color: status.fg }}
              >
                {status.label}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              U-{user.id.slice(0, 4).toUpperCase()} ・ {user.email} ・ 登録日 {formatDate(user.createdAt)}
            </div>
          </div>
        </div>
        <UserAccountActions userId={user.id} status={user.status} />
      </div>

      <div className="flex gap-4 mb-5 flex-wrap">
        {[
          { label: "お気に入り数", value: user._count.favorites },
          { label: "コメント数", value: user._count.comments },
          { label: "送信したリクエスト", value: user._count.sentRequests },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border rounded-2xl px-4.5 py-4 flex-1 min-w-[140px]">
            <div className="text-[11px] text-muted-foreground font-bold mb-1">{kpi.label}</div>
            <div className="text-xl font-black">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 flex-col md:flex-row">
        <div className="bg-card border border-border rounded-2xl p-5 px-5.5 flex-1">
          <div className="font-black text-sm mb-3.5">プロフィール情報</div>
          <div className="flex flex-col gap-2.5 text-[13px] mb-3.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">性別</span>
              <span>{user.gender ?? "未設定"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">年齢</span>
              <span>{user.age ? `${user.age}歳` : "未設定"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">住んでいる都道府県</span>
              <span>{user.homeArea?.name ?? "未設定"}</span>
            </div>
          </div>
          <div className="h-px bg-muted my-3.5" />
          <div className="text-[11px] font-bold text-muted-foreground mb-2">興味があるジャンル・テーマ</div>
          <div className="flex gap-1.5 flex-wrap mb-3.5">
            {user.interestTags.length === 0 && <span className="text-xs text-muted-foreground">未設定</span>}
            {user.interestTags.map((t) => (
              <span key={t.tagId} className="bg-muted text-[#475569] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                {t.tag.name}
              </span>
            ))}
          </div>
          <div className="text-[11px] font-bold text-muted-foreground mb-2">行ってみたい都道府県</div>
          <div className="flex gap-1.5 flex-wrap">
            {user.wishlistAreas.length === 0 && <span className="text-xs text-muted-foreground">未設定</span>}
            {user.wishlistAreas.map((a) => (
              <span key={a.areaId} className="bg-muted text-[#475569] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                {a.area.name}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 px-5.5 flex-[1.4]">
          <div className="font-black text-sm mb-3.5">最近のアクティビティ</div>
          <div className="flex flex-col gap-3">
            {activity.length === 0 && <p className="text-xs text-muted-foreground">まだ活動履歴がありません。</p>}
            {activity.map((a, i) => (
              <div key={i} className="flex justify-between items-center gap-2.5">
                <div className="text-[13px]">{a.text}</div>
                <div className="text-[11px] text-muted-foreground whitespace-nowrap">{formatDate(a.date)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, ACCOUNT_STATUS_LABEL } from "@/lib/format";

export default async function PlannerManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const planners = await prisma.plannerAccount.findMany({
    where: q
      ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      itineraries: { select: { id: true } },
      _count: { select: { itineraries: true } },
    },
  });

  const favoriteCounts = await prisma.favorite.groupBy({
    by: ["itineraryId"],
    _count: { _all: true },
  });
  const favoriteCountByItinerary = new Map(favoriteCounts.map((f) => [f.itineraryId, f._count._all]));

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <h1 className="text-lg font-black">プランナー一覧</h1>
        <form action="/planners" className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            name="q"
            defaultValue={q}
            placeholder="プランナーを検索"
            className="text-xs outline-none placeholder:text-muted-foreground"
          />
        </form>
      </div>
      <p className="text-xs text-muted-foreground mb-5">
        プランナーサイトのアカウント一覧です（しおりを投稿・編集できるアカウント）。
      </p>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["ID", "名前", "メールアドレス", "登録日", "投稿数", "累計いいね", "ステータス", ""].map((h) => (
                <th key={h} className="text-left text-[11px] text-muted-foreground font-bold px-3.5 pb-2.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {planners.map((planner) => {
              const totalFavorites = planner.itineraries.reduce(
                (sum, it) => sum + (favoriteCountByItinerary.get(it.id) ?? 0),
                0
              );
              const status = ACCOUNT_STATUS_LABEL[planner.status];
              return (
                <tr key={planner.id} className="border-t border-muted">
                  <td className="text-[13px] px-3.5 py-3">P-{planner.id.slice(0, 4).toUpperCase()}</td>
                  <td className="text-[13px] px-3.5 py-3">{planner.name}</td>
                  <td className="text-[13px] px-3.5 py-3">{planner.email}</td>
                  <td className="text-[13px] px-3.5 py-3">{formatDate(planner.createdAt)}</td>
                  <td className="text-[13px] px-3.5 py-3">{planner._count.itineraries}</td>
                  <td className="text-[13px] px-3.5 py-3">{totalFavorites}</td>
                  <td className="px-3.5 py-3">
                    <span
                      className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: status.bg, color: status.fg }}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-3.5 py-3">
                    <Link href={`/planners/${planner.id}`} className="text-xs font-bold text-primary">
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

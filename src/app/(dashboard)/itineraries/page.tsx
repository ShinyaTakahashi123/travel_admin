import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, ITINERARY_STATUS_LABEL } from "@/lib/format";

const FILTERS = [
  { key: undefined, label: "すべて" },
  { key: "pending", label: "承認待ち" },
  { key: "published", label: "公開中" },
  { key: "draft", label: "下書き" },
  { key: "rejected", label: "却下" },
  { key: "private", label: "非公開" },
  { key: "reported", label: "通報あり" },
] as const;

export default async function ItineraryManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;

  const pendingCount = await prisma.itinerary.count({ where: { status: "pending" } });

  const reportedItineraryIds =
    status === "reported"
      ? (
          await prisma.report.findMany({
            where: { targetType: "itinerary", status: "unread" },
            select: { targetId: true },
            distinct: ["targetId"],
          })
        ).map((r) => r.targetId)
      : undefined;

  const itineraries = await prisma.itinerary.findMany({
    where: {
      status: status && status !== "reported" ? status : { not: "deleted" },
      id: reportedItineraryIds ? { in: reportedItineraryIds } : undefined,
      title: q ? { contains: q, mode: "insensitive" } : undefined,
    },
    orderBy: status === "pending" ? { submittedAt: "asc" } : { updatedAt: "desc" },
    include: {
      plannerAccount: { select: { name: true } },
      areas: { include: { area: true }, take: 1 },
    },
  });

  return (
    <div>
      <h1 className="text-xl font-black mb-4.5">しおり管理</h1>

      <div className="flex items-center gap-2.5 mb-4.5 flex-wrap">
        {FILTERS.map((f) => (
          <Link
            key={f.label}
            href={f.key ? `/itineraries?status=${f.key}` : "/itineraries"}
            className={`text-sm font-medium px-4 py-1.5 rounded-full border flex items-center gap-1.5 ${
              (status ?? undefined) === f.key
                ? "bg-secondary border-[#C7CBFA] text-secondary-foreground font-bold"
                : f.key === "pending"
                  ? "border-[#FED7AA] text-[#C2410C] bg-white"
                  : f.key === "reported"
                    ? "border-border text-red-600 bg-white"
                    : "border-border bg-white"
            }`}
          >
            {f.label}
            {f.key === "pending" && pendingCount > 0 && (
              <span className="bg-[#EA580C] text-white text-xs font-black px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </Link>
        ))}
        <div className="flex-1" />
        <form action="/itineraries" className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5">
          {status && <input type="hidden" name="status" value={status} />}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            name="q"
            defaultValue={q}
            placeholder="タイトルで検索"
            className="text-sm outline-none placeholder:text-muted-foreground"
          />
        </form>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["ID", "タイトル", "投稿者", "エリア", "公開日", "閲覧数", "ステータス", ""].map((h) => (
                <th key={h} className="text-left text-sm text-muted-foreground font-bold px-3.5 pb-2.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {itineraries.map((item) => {
              const meta = ITINERARY_STATUS_LABEL[item.status];
              const isPending = item.status === "pending";
              return (
                <tr key={item.id} className={`border-t border-muted ${isPending ? "bg-amber-50" : ""}`}>
                  <td className="text-base px-3.5 py-3">T-{item.id.slice(0, 4).toUpperCase()}</td>
                  <td className="text-base px-3.5 py-3">{item.title}</td>
                  <td className="text-base px-3.5 py-3">{item.plannerAccount.name}</td>
                  <td className="text-base px-3.5 py-3">{item.areas[0]?.area.name ?? "—"}</td>
                  <td className="text-base px-3.5 py-3">
                    {isPending
                      ? `申請 ${formatDate(item.submittedAt ?? item.updatedAt)}`
                      : item.reviewedAt
                        ? formatDate(item.reviewedAt)
                        : "—"}
                  </td>
                  <td className="text-base px-3.5 py-3">{item.viewCount.toLocaleString()}</td>
                  <td className="px-3.5 py-3">
                    <span
                      className="text-sm font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: meta.bg, color: meta.fg }}
                    >
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-3.5 py-3">
                    <Link
                      href={`/itineraries/${item.id}`}
                      className={`text-sm font-bold ${isPending ? "text-secondary-foreground font-black" : "text-primary"}`}
                    >
                      {isPending ? "確認する" : "詳細"}
                    </Link>
                  </td>
                </tr>
              );
            })}
            {itineraries.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-base text-muted-foreground py-8">
                  該当するしおりはありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

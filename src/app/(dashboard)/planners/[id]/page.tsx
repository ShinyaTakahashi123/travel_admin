import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, ACCOUNT_STATUS_LABEL, ITINERARY_STATUS_LABEL } from "@/lib/format";
import { PlannerAccountActions } from "@/components/planner-account-actions";

export default async function PlannerAccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const planner = await prisma.plannerAccount.findUnique({
    where: { id },
    include: {
      homeArea: true,
      serviceAreas: { include: { area: true } },
      specialtyTags: { include: { tag: true } },
      itineraries: {
        orderBy: { createdAt: "desc" },
        include: { areas: { include: { area: true } }, _count: { select: { favorites: true } } },
      },
      receivedRequests: { select: { id: true } },
    },
  });
  if (!planner) notFound();

  const totalFavorites = planner.itineraries.reduce((sum, it) => sum + it._count.favorites, 0);
  const shareTotal = await prisma.shareLog.count({
    where: { itinerary: { plannerAccountId: id } },
  });
  const status = ACCOUNT_STATUS_LABEL[planner.status];

  return (
    <div>
      <div className="text-sm text-muted-foreground mb-2">
        <Link href="/planners">プランナー一覧</Link> &gt;{" "}
        <span className="text-foreground font-bold">{planner.name}</span>
      </div>

      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full bg-[#D6EEFB] flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="font-black text-xl">{planner.name}</div>
              <span
                className="text-sm font-bold px-2.5 py-0.5 rounded-full"
                style={{ background: status.bg, color: status.fg }}
              >
                {status.label}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              P-{planner.id.slice(0, 4).toUpperCase()} ・ {planner.email} ・ 登録日 {formatDate(planner.createdAt)}
            </div>
          </div>
        </div>
        <PlannerAccountActions plannerId={planner.id} status={planner.status} />
      </div>

      <div className="flex gap-4 mb-5 flex-wrap">
        {[
          { label: "投稿数", value: planner.itineraries.length },
          { label: "累計いいね", value: totalFavorites },
          { label: "累計SNS共有数", value: shareTotal },
          { label: "受信したリクエスト", value: planner.receivedRequests.length },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border rounded-2xl px-4.5 py-4 flex-1 min-w-[140px]">
            <div className="text-sm text-muted-foreground font-bold mb-1">{kpi.label}</div>
            <div className="text-2xl font-black">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 flex-col md:flex-row">
        <div className="bg-card border border-border rounded-2xl p-5 px-5.5 flex-1">
          <div className="font-black text-base mb-3.5">プロフィール情報</div>
          <div className="flex flex-col gap-2.5 text-base mb-3.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">性別</span>
              <span>{planner.gender ?? "未設定"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">年齢</span>
              <span>{planner.age ? `${planner.age}歳` : "未設定"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">住んでいる都道府県</span>
              <span>{planner.homeArea?.name ?? "未設定"}</span>
            </div>
          </div>
          <div className="h-px bg-muted my-3.5" />
          <div className="text-sm font-bold text-muted-foreground mb-2">プランニングできる都道府県</div>
          <div className="flex gap-1.5 flex-wrap mb-3.5">
            {planner.serviceAreas.length === 0 && <span className="text-sm text-muted-foreground">未設定</span>}
            {planner.serviceAreas.map((s) => (
              <span key={s.areaId} className="bg-muted text-[#475569] text-sm font-bold px-2.5 py-0.5 rounded-full">
                {s.area.name}
              </span>
            ))}
          </div>
          <div className="text-sm font-bold text-muted-foreground mb-2">得意なジャンル・テーマ</div>
          <div className="flex gap-1.5 flex-wrap mb-3.5">
            {planner.specialtyTags.length === 0 && <span className="text-sm text-muted-foreground">未設定</span>}
            {planner.specialtyTags.map((t) => (
              <span key={t.tagId} className="bg-muted text-[#475569] text-sm font-bold px-2.5 py-0.5 rounded-full">
                {t.tag.name}
              </span>
            ))}
          </div>
          {planner.profile && (
            <>
              <div className="text-sm font-bold text-muted-foreground mb-2">自己紹介</div>
              <div className="text-sm text-[#475569] leading-relaxed">{planner.profile}</div>
            </>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 px-5.5 flex-[1.4]">
          <div className="font-black text-base mb-3.5">投稿したしおり</div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["タイトル", "エリア", "閲覧数", "ステータス"].map((h) => (
                  <th key={h} className="text-left text-sm text-muted-foreground font-bold pb-2 pr-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {planner.itineraries.map((item) => {
                const status = ITINERARY_STATUS_LABEL[item.status];
                return (
                  <tr key={item.id} className="border-t border-muted">
                    <td className="text-sm py-2.5 pr-3">
                      <Link href={`/itineraries/${item.id}`} className="hover:underline">
                        {item.title}
                      </Link>
                    </td>
                    <td className="text-sm py-2.5 pr-3">
                      {item.areas.map((a) => a.area.name).join("・") || "—"}
                    </td>
                    <td className="text-sm py-2.5 pr-3">{item.viewCount.toLocaleString()}</td>
                    <td className="py-2.5">
                      <span
                        className="text-sm font-bold px-2.5 py-0.5 rounded-full"
                        style={{ background: status.bg, color: status.fg }}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

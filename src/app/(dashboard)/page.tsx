import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { jstDateKeyDaysAgo, jstMidnightUtc } from "@/lib/format";

const TAKEDOWN_INQUIRY_CATEGORY = "権利侵害・削除のご依頼";

function TrendCard({
  label,
  value,
  points,
  dates,
}: {
  label: string;
  value: string;
  points: number[];
  dates: string[];
}) {
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const w = 280;
  const h = 90;
  const step = points.length > 1 ? w / (points.length - 1) : 0;
  const coords = points.map((p, i) => {
    const x = i * step;
    const y = h - ((p - min) / range) * (h - 15) - 5;
    return [x, y] as const;
  });
  const polyline = coords.map(([x, y]) => `${x},${y}`).join(" ");
  const polygon = `0,${h} ${polyline} ${w},${h}`;

  return (
    <div className="bg-card border border-border rounded-2xl p-4.5 px-5 flex-1">
      <div className="text-sm text-muted-foreground font-bold mb-0.5">{label}</div>
      <div className="text-2xl font-black mb-2.5">{value}</div>
      {points.length > 1 ? (
        <>
          <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="90" preserveAspectRatio="none">
            <line x1="0" y1="20" x2={w} y2="20" stroke="#EEF1F6" strokeWidth="1" />
            <line x1="0" y1="50" x2={w} y2="50" stroke="#EEF1F6" strokeWidth="1" />
            <line x1="0" y1="80" x2={w} y2="80" stroke="#EEF1F6" strokeWidth="1" />
            <polygon points={polygon} fill="#6366F1" fillOpacity="0.08" />
            <polyline
              points={polyline}
              fill="none"
              stroke="#6366F1"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{dates[0]}</span>
            <span>{dates[Math.floor(dates.length / 2)]}</span>
            <span>{dates[dates.length - 1]}</span>
          </div>
        </>
      ) : (
        <div className="h-[90px] flex items-center justify-center text-sm text-muted-foreground">
          日次データはまだありません（夜間バッチ集計はPhase2で実装予定）
        </div>
      )}
    </div>
  );
}

export default async function DashboardPage() {
  // 「本日」は日本時間の0時区切りで判定する
  const todayStart = jstMidnightUtc(jstDateKeyDaysAgo(0));

  const [userCount, publishedCount, todayPvCount, pendingCount, unreadReportCount, unreadTakedownCount, dailyMetrics] =
    await Promise.all([
      prisma.userAccount.count(),
      prisma.itinerary.count({ where: { status: "published" } }),
      prisma.pageView.count({ where: { viewedAt: { gte: todayStart } } }),
      prisma.itinerary.count({ where: { status: "pending" } }),
      prisma.report.count({ where: { status: "unread" } }),
      prisma.inquiry.count({ where: { status: "unread", category: TAKEDOWN_INQUIRY_CATEGORY } }),
      prisma.dailyMetric.findMany({ orderBy: { metricDate: "asc" }, take: 14 }),
    ]);

  const dates = dailyMetrics.map((m) => `${m.metricDate.getUTCMonth() + 1}/${m.metricDate.getUTCDate()}`);

  return (
    <div>
      <h1 className="text-xl font-black mb-5">ダッシュボード</h1>

      <div className="flex gap-4 mb-7 flex-wrap">
        {[
          { label: "登録ユーザー数", value: userCount.toLocaleString() },
          { label: "公開中のしおり", value: publishedCount.toLocaleString() },
          { label: "本日のPV", value: todayPvCount.toLocaleString() },
          {
            label: "承認待ちのしおり",
            value: pendingCount.toLocaleString(),
            color: pendingCount > 0 ? "#C2410C" : undefined,
          },
          {
            label: "未対応の通報",
            value: unreadReportCount.toLocaleString(),
            color: unreadReportCount > 0 ? "#EF4444" : undefined,
          },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border rounded-2xl px-5 py-4.5 flex-1 min-w-[150px]">
            <div className="text-sm text-muted-foreground font-bold mb-1.5">{kpi.label}</div>
            <div className="text-2xl font-black" style={{ color: kpi.color }}>
              {kpi.value}
            </div>
          </div>
        ))}
        <Link
          href={`/inquiries?category=${encodeURIComponent(TAKEDOWN_INQUIRY_CATEGORY)}`}
          className="bg-card border border-border rounded-2xl px-5 py-4.5 flex-1 min-w-[150px] hover:border-[#EF4444] transition-colors"
        >
          <div className="text-sm text-muted-foreground font-bold mb-1.5">未対応の権利侵害・削除依頼</div>
          <div className="text-2xl font-black" style={{ color: unreadTakedownCount > 0 ? "#EF4444" : undefined }}>
            {unreadTakedownCount.toLocaleString()}
          </div>
        </Link>
      </div>

      <h2 className="text-lg font-black mb-3">日次推移（直近14日）</h2>
      <div className="flex gap-4 flex-col md:flex-row">
        <TrendCard
          label="登録ユーザー数"
          value={
            dailyMetrics.length
              ? dailyMetrics[dailyMetrics.length - 1].totalUserAccounts.toLocaleString()
              : userCount.toLocaleString()
          }
          points={dailyMetrics.map((m) => m.totalUserAccounts)}
          dates={dates}
        />
        <TrendCard
          label="公開中のしおり数"
          value={
            dailyMetrics.length
              ? dailyMetrics[dailyMetrics.length - 1].totalPublishedItineraries.toLocaleString()
              : publishedCount.toLocaleString()
          }
          points={dailyMetrics.map((m) => m.totalPublishedItineraries)}
          dates={dates}
        />
        <TrendCard
          label="PV数"
          value={
            dailyMetrics.length
              ? dailyMetrics[dailyMetrics.length - 1].pvCount.toLocaleString()
              : todayPvCount.toLocaleString()
          }
          points={dailyMetrics.map((m) => m.pvCount)}
          dates={dates}
        />
      </div>
    </div>
  );
}

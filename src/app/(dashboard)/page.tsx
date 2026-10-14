import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { jstDateKeyDaysAgo, jstMidnightUtc, toJstDateKey } from "@/lib/format";
import { botNameLabel } from "@/lib/bot-name-label";
import { TrendCard } from "@/components/dashboard-trend-chart";

const TAKEDOWN_INQUIRY_CATEGORY = "権利侵害・削除のご依頼";
const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

export default async function DashboardPage() {
  // 「本日」は日本時間の0時区切りで判定する
  const todayStart = jstMidnightUtc(jstDateKeyDaysAgo(0));
  const sevenDaysAgoStart = jstMidnightUtc(jstDateKeyDaysAgo(6)); // 今日を含めて直近7日

  const [
    userCount,
    publishedCount,
    todayPvCount,
    todayBotCount,
    pendingCount,
    unreadReportCount,
    unreadTakedownCount,
    dailyMetricsDesc,
    botBreakdownToday,
    botBreakdown7days,
    earliestBotPageView,
  ] = await Promise.all([
    prisma.userAccount.count(),
    prisma.itinerary.count({ where: { status: "published" } }),
    prisma.pageView.count({ where: { viewedAt: { gte: todayStart }, isBot: false } }),
    prisma.pageView.count({ where: { viewedAt: { gte: todayStart }, isBot: true } }),
    prisma.itinerary.count({ where: { status: "pending" } }),
    prisma.report.count({ where: { status: "unread" } }),
    prisma.inquiry.count({ where: { status: "unread", category: TAKEDOWN_INQUIRY_CATEGORY } }),
    // 新しい日が毎晩増えていくため、直近14日を取るには「新しいほうから14件」を取って
    // あとで古い順に並べ直す(「古いほうから14件」だと、15日目以降は最新日が出ない。
    // セキュリティ指摘2026-10-10)
    prisma.dailyMetric.findMany({ orderBy: { metricDate: "desc" }, take: 14 }),
    prisma.pageView.groupBy({
      by: ["botName"],
      where: { viewedAt: { gte: todayStart }, isBot: true },
      _count: true,
      orderBy: { _count: { botName: "desc" } },
    }),
    prisma.pageView.groupBy({
      by: ["botName"],
      where: { viewedAt: { gte: sevenDaysAgoStart }, isBot: true },
      _count: true,
      orderBy: { _count: { botName: "desc" } },
    }),
    // ロボットを外す対応が本番でいつから効いているかを、実際のデータから推測する
    // (is_botの行は新しいコードでしか作られないため、一番古いis_botの行の日付を、
    // 「この日からロボットが数に入らなくなった」の目安として使う。企画運営2026-10-10)
    prisma.pageView.findFirst({ where: { isBot: true }, orderBy: { viewedAt: "asc" }, select: { viewedAt: true } }),
  ]);

  const dailyMetrics = [...dailyMetricsDesc].reverse();
  const dates = dailyMetrics.map((m) => `${m.metricDate.getUTCMonth() + 1}/${m.metricDate.getUTCDate()}`);
  // グラフの読み取り(選んだ日の行)用。曜日まで含めた表示にする
  const dateLabels = dailyMetrics.map(
    (m) => `${m.metricDate.getUTCMonth() + 1}/${m.metricDate.getUTCDate()}（${WEEKDAY_LABELS[m.metricDate.getUTCDay()]}）`
  );
  const botFilterSinceLabel = earliestBotPageView
    ? (() => {
        const [, m, d] = toJstDateKey(earliestBotPageView.viewedAt).split("-").map(Number);
        return `${m}/${d}`;
      })()
    : null;

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

      <div className="text-sm text-muted-foreground mb-7 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>
          本日のロボット: <span className="font-bold">{todayBotCount.toLocaleString()}</span>件
          {botBreakdownToday.length > 0 && (
            <>
              （
              {botBreakdownToday
                .map((b) => `${botNameLabel(b.botName)} ${b._count.toLocaleString()}件`)
                .join("・")}
              ）
            </>
          )}
        </span>
        {botBreakdown7days.length > 0 && (
          <span>
            直近7日のロボット:{" "}
            {botBreakdown7days.map((b) => `${botNameLabel(b.botName)} ${b._count.toLocaleString()}件`).join("・")}
          </span>
        )}
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
          dateLabels={dateLabels}
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
          dateLabels={dateLabels}
        />
        <TrendCard
          label={dailyMetrics.length ? `PV数（${dates[dates.length - 1]}まで）` : "PV数"}
          value={
            dailyMetrics.length
              ? dailyMetrics[dailyMetrics.length - 1].pvCount.toLocaleString()
              : todayPvCount.toLocaleString()
          }
          points={dailyMetrics.map((m) => m.pvCount)}
          dates={dates}
          dateLabels={dateLabels}
          footnote={
            botFilterSinceLabel
              ? `${botFilterSinceLabel}より前はロボットのアクセスを含みます`
              : "グラフの大きな数字は、毎晩の集計による「前日まで」の値です。今日の分は上の「本日のPV」をご覧ください"
          }
        />
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { jstMidnightUtc, dateKeyToDateOnly } from "@/lib/format";

// 毎晩のCron(/api/cron/daily-metrics)と、直近14日分を埋めるスクリプト
// (prisma/backfill-daily-metrics.ts)が共通で使う、1日分のdaily_metricを作る処理。
// 何度実行しても同じ結果になる(upsertなので、同じ日の行は増えずに上書きされる)
export type DailyMetricResult = {
  metricDate: string; // YYYY-MM-DD(日本時間)
  totalUserAccounts: number;
  totalPublishedItineraries: number;
  pvCount: number;
};

// 指定した日本時間の1日(dateKey)分の集計値を計算する(DBには書き込まない)
export async function computeDailyMetric(dateKey: string, nextDateKey: string): Promise<DailyMetricResult> {
  const dayStart = jstMidnightUtc(dateKey);
  const dayEnd = jstMidnightUtc(nextDateKey);

  const [totalUserAccounts, totalPublishedItineraries, pvCount] = await Promise.all([
    // その日の終わり(=翌日の0時)の時点で登録されていた会員数(退会した人も含むため、だいたいの数)
    prisma.userAccount.count({ where: { createdAt: { lt: dayEnd } } }),
    // 過去の状態の記録がないため、今公開中のしおりを公開した日で数える、だいたいの数
    prisma.itinerary.count({ where: { status: "published", reviewedAt: { lt: dayEnd } } }),
    // 人の閲覧だけを数える(ロボットを外す対応より前の日は、ロボットの分も混ざる)
    prisma.pageView.count({ where: { viewedAt: { gte: dayStart, lt: dayEnd }, isBot: false } }),
  ]);

  return { metricDate: dateKey, totalUserAccounts, totalPublishedItineraries, pvCount };
}

// 計算した1日分の値を、daily_metricにupsertする(同じ日の行があれば上書き)
export async function upsertDailyMetric(result: DailyMetricResult): Promise<void> {
  await prisma.dailyMetric.upsert({
    where: { metricDate: dateKeyToDateOnly(result.metricDate) },
    create: {
      metricDate: dateKeyToDateOnly(result.metricDate),
      totalUserAccounts: result.totalUserAccounts,
      totalPublishedItineraries: result.totalPublishedItineraries,
      pvCount: result.pvCount,
    },
    update: {
      totalUserAccounts: result.totalUserAccounts,
      totalPublishedItineraries: result.totalPublishedItineraries,
      pvCount: result.pvCount,
    },
  });
}

import { NextResponse } from "next/server";
import { jstDateKeyDaysAgo } from "@/lib/format";
import { computeDailyMetric, upsertDailyMetric } from "@/lib/daily-metrics";

// Vercel Cron（vercel.json、日本時間0:10ごろ）から1日1回呼ばれ、前日分のdaily_metricを
// 書く（docs/specs/20261010-admin-daily-chart.md）。同じ日の行があれば上書き（upsert）するため、
// 何度動かしても結果は同じ（行は増えない）
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 「前日」は日本時間の0時区切り。0:10ごろに動く想定なので、daysAgo=1が前日になる
  const dateKey = jstDateKeyDaysAgo(1);
  const nextDateKey = jstDateKeyDaysAgo(0);

  const result = await computeDailyMetric(dateKey, nextDateKey);
  await upsertDailyMetric(result);

  // 応答・ログとも件数と日付だけ（個人情報・User-Agent等は扱わない）
  console.log(`daily-metrics: ${dateKey} total_user_accounts=${result.totalUserAccounts} total_published_itineraries=${result.totalPublishedItineraries} pv_count=${result.pvCount}`);

  return NextResponse.json(result);
}

/**
 * daily_metric（日次推移のグラフの元データ）の直近14日分を埋めるスクリプト
 * (docs/specs/20261010-admin-daily-chart.md)
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/backfill-daily-metrics.ts
 *   登録モード: npx tsx prisma/backfill-daily-metrics.ts --commit
 *
 * 何度実行しても安全（同じ日の行があれば上書きするだけで、行は増えない）。
 * 毎晩のCron（/api/cron/daily-metrics）が始まってからは、このスクリプトを
 * 毎回実行する必要はない（最初の1回、グラフに過去分を表示するために使う）。
 */
import { jstDateKeyDaysAgo } from "../src/lib/format";
import { computeDailyMetric, upsertDailyMetric } from "../src/lib/daily-metrics";

// 接続先(本番/開発)の表示と確かめ(企画運営2026-09-27)。Next.jsアプリ本体からは読み込まれない
require("../scripts/assert-db-target.cjs");

const COMMIT = process.argv.includes("--commit");

async function main() {
  console.log(COMMIT ? "登録モードで実行します" : "確認モードで実行します（DBには書き込みません）");
  console.log("");

  // 直近14日分（今日を含む）を、古い日から順に埋める
  for (let daysAgo = 13; daysAgo >= 0; daysAgo--) {
    const dateKey = jstDateKeyDaysAgo(daysAgo);
    const nextDateKey = jstDateKeyDaysAgo(daysAgo - 1);
    const result = await computeDailyMetric(dateKey, nextDateKey);

    console.log(
      `${result.metricDate}: 会員数=${result.totalUserAccounts} 公開中のしおり=${result.totalPublishedItineraries} PV=${result.pvCount}`
    );

    if (COMMIT) {
      await upsertDailyMetric(result);
    }
  }

  console.log("");
  console.log(COMMIT ? "登録しました" : "確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
}

main();

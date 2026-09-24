/**
 * 本番データベースの定期バックアップ（docs/specs/20260924-db-backup.md）
 *
 * 全テーブルを読み取りのみで書き出し、1つの圧縮ファイル（.json.gz）にまとめる。
 * 保存先はどのGitリポジトリにも含まれない C:\03_ClaudeCode\backups\shiorie\。
 * 新しいものから8世代を残し、それより古いものは自動的に削除する。
 *
 * 実装メモ: Prismaのモデル経由（`prisma.xxx.findMany()`）だと、ローカルのschema.prismaが
 * 本番DBにまだ適用されていない列を含んでいる場合（マイグレーション未適用のスキーマ差分）に
 * 「列が存在しない」エラーで失敗する。バックアップは本番DBの「今ある姿」をそのまま複製するのが
 * 目的なので、$queryRawUnsafe で各テーブルを SELECT * する（スキーマ差分の影響を受けない）。
 *
 * 注意: Request.message は中身を表示・確認せず、件数のみ表示する（ファイルには含める）。
 *
 * 実行方法: npx tsx prisma/backup-db.ts
 */
import fs from "fs";
import path from "path";
import zlib from "zlib";
import { prisma } from "../src/lib/prisma";

const BACKUP_DIR = "C:\\03_ClaudeCode\\backups\\shiorie";
const KEEP_GENERATIONS = 8;

// バックアップ対象のテーブル（DB上の実テーブル名。@@mapに合わせたsnake_case）
const TABLES = [
  "area", "place_master", "tag", "purpose_tag",
  "user_account", "user_wishlist_area", "user_interest_tag", "subscription",
  "planner_account", "planner_service_area", "planner_specialty_tag", "admin",
  "itinerary", "itinerary_area", "itinerary_tag", "itinerary_purpose_tag",
  "day", "spot", "photo",
  "favorite", "comment", "report", "inquiry", "share_log", "request", "page_view",
  "daily_metric", "rate_limit_event",
  "_prisma_migrations",
];

function jsonReplacer(_key: string, value: unknown) {
  if (typeof value === "bigint") return { __bigint__: value.toString() };
  return value;
}

async function main() {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  console.log("本番DBの全テーブルを読み取ります（読み取りのみ、書き込みは行いません）...\n");

  const tables: Record<string, unknown[]> = {};
  const counts: Record<string, number> = {};

  for (const table of TABLES) {
    try {
      const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM "${table}"`);
      tables[table] = rows;
      counts[table] = rows.length;
      const display = table === "request" ? `${rows.length}件（本文は表示しません）` : `${rows.length}件`;
      console.log(`  ${table}: ${display}`);
    } catch (e) {
      console.warn(`  ${table}: 読み取りに失敗しました（${(e as Error).message}）`);
      tables[table] = [];
      counts[table] = 0;
    }
  }

  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  const fileName = `shiorie-db-${stamp}.json.gz`;
  const filePath = path.join(BACKUP_DIR, fileName);

  const payload = JSON.stringify({ createdAt: now.toISOString(), tables }, jsonReplacer);
  const gzipped = zlib.gzipSync(Buffer.from(payload, "utf8"), { level: 9 });
  fs.writeFileSync(filePath, gzipped);

  const sizeMB = (gzipped.length / 1024 / 1024).toFixed(2);
  console.log(`\n保存しました: ${filePath}（${sizeMB} MB）`);

  // 世代管理: 新しい順に8世代を残し、それより古いものを削除
  const existing = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => /^shiorie-db-\d{8}-\d{4}\.json\.gz$/.test(f))
    .sort()
    .reverse();

  const toDelete = existing.slice(KEEP_GENERATIONS);
  for (const f of toDelete) {
    fs.unlinkSync(path.join(BACKUP_DIR, f));
    console.log(`古い世代を削除しました: ${f}`);
  }
  console.log(`\n保存されている世代数: ${Math.min(existing.length, KEEP_GENERATIONS)}件（最大${KEEP_GENERATIONS}世代）`);

  console.log("\n=== テーブルごとの件数（サマリー） ===");
  for (const [name, count] of Object.entries(counts)) {
    console.log(`  ${name}: ${count}件`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

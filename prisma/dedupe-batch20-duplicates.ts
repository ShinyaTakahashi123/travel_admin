/**
 * バッチ20（香川県）コミット時に、バックグラウンドで実行中だった前回のプロセスと
 * 手動での再実行が競合し、8件の完全重複（同一タイトル）が作成されていたことが判明したための削除。
 * 各ペアのうち、createdAtが後のもの（重複して作られた方）を削除する。
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/dedupe-batch20-duplicates.ts
 *   削除モード: npx tsx prisma/dedupe-batch20-duplicates.ts --commit
 */
import { prisma } from "../src/lib/prisma";

async function main() {
  const commit = process.argv.includes("--commit");
  console.log(commit ? "削除モードで実行します" : "確認モードで実行します（DBには書き込みません）");

  const its = await prisma.itinerary.findMany({
    where: { status: "published" },
    select: { id: true, title: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  const byTitle = new Map<string, typeof its>();
  for (const it of its) {
    const arr = byTitle.get(it.title) ?? [];
    arr.push(it);
    byTitle.set(it.title, arr);
  }
  const dups = [...byTitle.entries()].filter(([, arr]) => arr.length > 1);

  console.log(`\n重複タイトル件数: ${dups.length}`);
  const toDelete: string[] = [];
  for (const [title, arr] of dups) {
    const [keep, ...rest] = arr; // 最初に作られたものを残す
    console.log(`\n■ ${title}`);
    console.log(`  残す: id=${keep.id} (${keep.createdAt.toISOString()})`);
    for (const r of rest) {
      console.log(`  削除: id=${r.id} (${r.createdAt.toISOString()})`);
      toDelete.push(r.id);
    }
  }

  if (!commit) {
    console.log(`\n削除予定件数: ${toDelete.length}`);
    console.log("確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
    return;
  }

  const result = await prisma.itinerary.deleteMany({ where: { id: { in: toDelete } } });
  console.log(`\n削除しました: ${result.count}件`);
  const remaining = await prisma.itinerary.count({ where: { status: "published" } });
  console.log(`削除後の公開しおり件数: ${remaining}件`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

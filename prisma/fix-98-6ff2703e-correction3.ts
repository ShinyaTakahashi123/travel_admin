/**
 * #98 訂正その3。法務の本番確認(2026-10-30 13:30)の指摘。
 * 安倍晴明神社の書き出しに実際の分数(2分)を入れる(決まり145)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-98-6ff2703e-correction3.ts
 *   反映: npm run prod -- npx tsx prisma/fix-98-6ff2703e-correction3.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const ABENOSEIMEIJINJA_ID = "96ac4437-8ead-4d46-a02c-bd2b6a3575e6";
const FIND = "阿倍王子神社から歩いてすぐ。";
const REPLACE = "阿倍王子神社から歩いて約2分。";

async function main() {
  const commit = process.argv.includes("--commit");

  const spot = await prisma.spot.findFirstOrThrow({ where: { id: ABENOSEIMEIJINJA_ID } });
  if (!spot.memo?.includes(FIND)) {
    console.log(`[想定と違います] 「${FIND}」が見つかりません。処理を中止します。`);
    return;
  }
  const newMemo = spot.memo.replace(FIND, REPLACE);

  console.log("=== #98 訂正その3 ===");
  console.log(newMemo.slice(0, 60));

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({ where: { id: ABENOSEIMEIJINJA_ID }, data: { memo: newMemo } });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

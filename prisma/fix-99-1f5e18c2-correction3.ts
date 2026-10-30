/**
 * #99 訂正その3。法務の指摘(2026-10-30 14:13): 城山展望台の終わりの文で、
 * タクシーの行き先(西郷南洲顕彰館)より先に「この区間は〜便利です」が来ており、
 * つながりが不自然。行き先の文を先にし、便利ですの一文をあとに置く。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-99-1f5e18c2-correction3.ts
 *   反映: npm run prod -- npx tsx prisma/fix-99-1f5e18c2-correction3.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const SHIROYAMA_ID = "01c372fb-4095-47f3-a1bd-d2ad63ff34e9";
const FIND = "見学を終えたら、この区間は、タクシーを使うと便利です。タクシーでおよそ11分、西郷南洲顕彰館へ向かいましょう。";
const REPLACE = "見学を終えたら、タクシーでおよそ11分、西郷南洲顕彰館へ向かいましょう。この区間は、タクシーを使うと便利です。";

async function main() {
  const commit = process.argv.includes("--commit");

  const spot = await prisma.spot.findFirstOrThrow({ where: { id: SHIROYAMA_ID } });
  if (!spot.memo?.includes(FIND)) {
    console.log(`[想定と違います] 「${FIND}」が見つかりません。処理を中止します。`);
    return;
  }
  const newMemo = spot.memo.replace(FIND, REPLACE);

  console.log("=== #99 訂正その3 ===");
  console.log(newMemo.slice(-120));

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({ where: { id: SHIROYAMA_ID }, data: { memo: newMemo } });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

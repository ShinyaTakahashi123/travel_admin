/**
 * 冬の特集の見直し(docs/content/20261102-winter-feature-rule-pass.md)。
 * 伊勢神宮の初詣(c9b3ad40、published)。
 *
 * 直すこと: 伊勢神宮外宮の最後の文「歩いておよそ8分、倭姫宮へ」が、実際のtransitLeg(22分)・
 * 倭姫宮の書き出し「外宮から歩いておよそ22分」と合っていない(2章)。8分→22分に直す。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-winter-ise.ts
 *   反映: npm run prod -- npx tsx prisma/fix-winter-ise.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const SPOT_ID = "e6ac61de-87f8-4cf7-b5f0-2daa5488cc01";
const FIND = "時間に余裕を持って訪れましょう。この後は、歩いておよそ8分、倭姫宮へ向かいましょう。";
const REPLACE = "時間に余裕を持って訪れましょう。この後は、歩いておよそ22分、倭姫宮へ向かいましょう。";

async function main() {
  const commit = process.argv.includes("--commit");
  const spot = await prisma.spot.findUniqueOrThrow({ where: { id: SPOT_ID } });
  if (!spot.memo?.includes(FIND)) {
    console.log("[想定と違います] メモに対象の文が見つかりません。処理を中止します。");
    console.log("現在のメモ:", spot.memo);
    return;
  }
  const newMemo = spot.memo.replace(FIND, REPLACE);
  console.log("直前:", spot.memo);
  console.log("直後:", newMemo);

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }
  await prisma.spot.update({ where: { id: SPOT_ID }, data: { memo: newMemo } });
  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

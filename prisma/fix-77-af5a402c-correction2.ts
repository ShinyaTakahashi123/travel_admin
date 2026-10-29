/**
 * #77の訂正2。定禅寺通りの「〜てみてください」を見落としていた
 * (法務の指摘)。「のんびりと歩いてみてください。」→「のんびりと
 * 歩きましょう。」に直す。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-77-af5a402c-correction2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-77-af5a402c-correction2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const TEIZENJI_ID = "6f76a6fd-0ac3-4ac2-90eb-2ee8b1ab1043";

const FIND = "季節ごとに違う表情を見せてくれるこの並木道を、のんびりと歩いてみてください。";
const REPLACE = "季節ごとに違う表情を見せてくれるこの並木道を、のんびりと歩きましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const spot = await prisma.spot.findFirstOrThrow({ where: { id: TEIZENJI_ID } });
  if (!spot.memo?.includes(FIND)) {
    console.log(`[想定と違います] 定禅寺通りに「${FIND}」が見つかりません。処理を中止します。`);
    return;
  }
  const newMemo = spot.memo!.replace(FIND, REPLACE);

  console.log("=== #77 訂正2: 定禅寺通りの言葉づかい ===");
  console.log(newMemo);

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({ where: { id: TEIZENJI_ID }, data: { memo: newMemo } });
  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

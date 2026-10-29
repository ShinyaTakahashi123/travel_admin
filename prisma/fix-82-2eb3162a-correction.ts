/**
 * #82の緊急訂正。fix-82-2eb3162a.tsで3日目を並べ替えた際、新しい1か所目
 * になる京都御所のtransitLegsを消し忘れ、もとの文化博物館からのleg
 * (train/10)が残っていた(itinerary-audit.cjsで発見)。1か所目にlegは
 * 不要なため削除する。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-82-2eb3162a-correction.ts
 *   反映: npm run prod -- npx tsx prisma/fix-82-2eb3162a-correction.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const GOSHO_ID = "ca692169-498a-49be-bd5d-af3152dade5c";

async function main() {
  const commit = process.argv.includes("--commit");

  console.log("=== #82 緊急訂正: 京都御所(1か所目)の不要なlegを削除 ===");
  console.log("削除するleg: train/10分(もと京都文化博物館からの区間、文化博物館を外した際の名残)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({ where: { id: GOSHO_ID }, data: { transitLegs: { deleteMany: {} } } });
  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

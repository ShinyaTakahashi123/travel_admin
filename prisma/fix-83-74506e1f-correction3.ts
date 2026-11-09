/**
 * #83の訂正その3。法務の指摘・企画運営の判断で、「熊野本宮大社前で昼食」の点を、
 * 名前のない鳥居(node7461114803)から、同じ場所にあるバス停「本宮大社前」の点
 * (OSM node5115806145、#166那覇の同名バス停の例外と同じ考え方)に直す。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-83-74506e1f-correction3.ts
 *   反映: npm run prod -- npx tsx prisma/fix-83-74506e1f-correction3.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const HONGU_LUNCH_ID = "aca8dcce-78af-4d89-b3f0-2f1478984172";

async function main() {
  const commit = process.argv.includes("--commit");

  console.log("=== #83 訂正その3: 熊野本宮大社前で昼食の点を直す ===");
  console.log("33.841112,135.773327(名前のない鳥居) → 33.838959,135.775004(バス停「本宮大社前」node5115806145)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({ where: { id: HONGU_LUNCH_ID }, data: { lat: 33.838959, lng: 135.775004 } });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

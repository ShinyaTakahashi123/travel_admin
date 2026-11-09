/**
 * #84の訂正その3。法務の指摘で、丸めの直し2点。
 * - 天武・持統天皇陵: 34.468756,135.807825 → 34.468493,135.807969(way807692780、約30m)
 * - 甘樫丘: 34.479706,135.815664 → 34.47972,135.815547(node4049734908「甘樫丘展望台」、約11m)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-84-27a60951-correction3.ts
 *   反映: npm run prod -- npx tsx prisma/fix-84-27a60951-correction3.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const TENMU_ID = "d2ee83f9-5c34-4750-8c28-eeba6b234b03";
const AMAKASHI_ID = "8e014793-7819-430e-9947-d8ac04585f0e";

async function main() {
  const commit = process.argv.includes("--commit");

  console.log("=== #84 訂正その3: 座標の丸めを直す ===");
  console.log("天武・持統天皇陵: 34.468756,135.807825 → 34.468493,135.807969");
  console.log("甘樫丘: 34.479706,135.815664 → 34.47972,135.815547");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction([
    prisma.spot.update({ where: { id: TENMU_ID }, data: { lat: 34.468493, lng: 135.807969 } }),
    prisma.spot.update({ where: { id: AMAKASHI_ID }, data: { lat: 34.47972, lng: 135.815547 } }),
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

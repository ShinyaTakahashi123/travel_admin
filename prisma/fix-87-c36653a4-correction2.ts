/**
 * #87の訂正その2。法務の指摘で、座標の丸めを直す2点。
 * - 小樽芸術村: 43.197399,141.001508(案内図の点) → node3086081067「似鳥美術館」
 *   (43.1972362,141.0018641、約30m)
 * - 天狗山: 43.171959,140.972103(名前のない建物の中心) → node6057324225
 *   「天狗山ロープウェイ山頂駅」(43.1719793,140.9721664)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-87-c36653a4-correction2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-87-c36653a4-correction2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const GEIJUTSUMURA_ID = "59ea05e8-cae2-4f46-845f-4e232ca07b66";
const TENGUYAMA_ID = "436f54d1-a07b-4d55-8d52-03748b587c10";

async function main() {
  const commit = process.argv.includes("--commit");

  console.log("=== #87 訂正その2: 座標の丸めを直す ===");
  console.log("小樽芸術村: 43.197399,141.001508 → 43.1972362,141.0018641(似鳥美術館)");
  console.log("天狗山: 43.171959,140.972103 → 43.1719793,140.9721664(ロープウェイ山頂駅)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction([
    prisma.spot.update({ where: { id: GEIJUTSUMURA_ID }, data: { lat: 43.1972362, lng: 141.0018641 } }),
    prisma.spot.update({ where: { id: TENGUYAMA_ID }, data: { lat: 43.1719793, lng: 140.9721664 } }),
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

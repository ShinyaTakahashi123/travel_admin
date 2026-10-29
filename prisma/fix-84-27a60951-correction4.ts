/**
 * #84の訂正その4。法務の再確認で、亀石にOSMのnode4469534110「亀石」
 * (historic=archaeological_site、34.4711294,135.8115766)が実在することが分かった
 * (前回の検索のやり方が悪く見つけられなかった)。案内板の例外ではなく、この点に直す
 * (今の値34.471092,135.811598との差は約4m)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-84-27a60951-correction4.ts
 *   反映: npm run prod -- npx tsx prisma/fix-84-27a60951-correction4.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const KAMEISHI_ID = "0b076aec-c58d-4a91-95d5-f1ef6d507816";

async function main() {
  const commit = process.argv.includes("--commit");

  console.log("=== #84 訂正その4: 亀石の座標を直す ===");
  console.log("34.471092,135.811598 → 34.4711294,135.8115766(node4469534110「亀石」、約4m)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({ where: { id: KAMEISHI_ID }, data: { lat: 34.4711294, lng: 135.8115766 } });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

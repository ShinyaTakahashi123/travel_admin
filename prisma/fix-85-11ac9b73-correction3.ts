/**
 * #85の訂正その3。法務の指摘で、道の駅川辺やすらぎの郷の座標を直す(約10mのずれ)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-85-11ac9b73-correction3.ts
 *   反映: npm run prod -- npx tsx prisma/fix-85-11ac9b73-correction3.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const MICHINOEKI_ID = "1d4e4c09-f24d-4cbc-9a45-0185e4d8468f";

async function main() {
  const commit = process.argv.includes("--commit");

  console.log("=== #85 訂正その3: 道の駅川辺やすらぎの郷の座標を直す ===");
  console.log("31.412546,130.432751 → 31.412493,130.432666(way436882564)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({ where: { id: MICHINOEKI_ID }, data: { lat: 31.412493, lng: 130.432666 } });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

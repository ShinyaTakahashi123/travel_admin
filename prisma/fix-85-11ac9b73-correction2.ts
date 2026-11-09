/**
 * #85の訂正その2。法務の指摘(2026-10-30 05:36)で、2日目の知覧武家屋敷庭園の点
 * (31.379976,130.447708)が国道の上で、名前の地物でないことが分かった。
 * OSM node6698678597「Chiran Samurai Residence」(tourism=attraction、
 * 31.378413,130.444657)に直す。前後の車の時間(豊玉姫神社から3.3分・道の駅まで13.3分、
 * いずれももとの値との差が小さいため変更なし)を確かめ済み。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-85-11ac9b73-correction2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-85-11ac9b73-correction2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const BUKEYASHIKI_ID = "5b60199c-1949-4b4f-97ed-5f39509320c6";

async function main() {
  const commit = process.argv.includes("--commit");

  console.log("=== #85 訂正その2: 知覧武家屋敷庭園の点を直す ===");
  console.log("31.379976,130.447708(国道の上) → 31.378413,130.444657(node6698678597)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({ where: { id: BUKEYASHIKI_ID }, data: { lat: 31.378413, lng: 130.444657 } });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

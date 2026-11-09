/**
 * #103 白石城(orderNo=1)に、削除した材木岩公園からの古いtransitLeg(car/20)が
 * 残っていたため削除する。setDaySpotOrderで材木岩公園を削除した際、白石城自身のdataに
 * transitLegsを含めなかったため、古い行が残ったまま。orderNo=1のスポットは
 * transitLegsが空であるべき(他のスポットの例: 蔵王酪農センターはtransitLegs=[])。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-103-correction.ts
 *   反映: npm run prod -- npx tsx prisma/fix-103-correction.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const SHIROISHIJO_ID = "ce201a11-483f-44c2-aa8d-9f658717eeb9";

async function main() {
  const commit = process.argv.includes("--commit");

  const legs = await prisma.spotTransitLeg.findMany({ where: { spotId: SHIROISHIJO_ID } });
  console.log("=== 白石城の現在のtransitLegs ===");
  console.log(legs);

  if (legs.length === 0) {
    console.log("すでに空です。処理を中止します。");
    return;
  }

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spotTransitLeg.deleteMany({ where: { spotId: SHIROISHIJO_ID } });

  console.log("\n[--commit] 削除しました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

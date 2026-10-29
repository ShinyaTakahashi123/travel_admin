/**
 * #75の緊急訂正。fix-75-b0b1115c.tsの --commit で、移動(transitLegs)は
 * 「到着する側のスポット」に記録することを忘れ、大神山神社奥宮
 * (到着する側、本来は大山寺→奥宮のwalk/15分で無変更のはず)に
 * car/12分を書き込んでしまい、桝水高原(到着する側、奥宮→桝水を
 * car/20→12分に直すはずだった)が無変更のまま残っていた。
 *
 * 訂正: 奥宮のlegをwalk/15分(もとの値)に戻し、桝水高原のlegをcar/12分
 * (直すはずだった値)に直す。visitTime・stayはすべて無変更(すでに正しい)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-75-b0b1115c-correction.ts
 *   反映: npm run prod -- npx tsx prisma/fix-75-b0b1115c-correction.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const OKUMIYA_ID = "45809240-4065-42bc-a4d3-9c400ec521c2";
const MASUIZU_ID = "13b354d0-c391-46b0-849e-086562d47748";

async function main() {
  const commit = process.argv.includes("--commit");

  console.log("=== #75 緊急訂正: legの付け間違いを直す ===\n");
  console.log("[大神山神社奥宮] leg: car/12分 → walk/15分(もとの値に戻す)");
  console.log("[桝水高原] leg: car/20分 → car/12分(直すはずだった値)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({
    where: { id: OKUMIYA_ID },
    data: {
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15 }] },
    },
  });
  await prisma.spot.update({
    where: { id: MASUIZU_ID },
    data: {
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 12 }] },
    },
  });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

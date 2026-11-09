/**
 * #72(浦富海岸、山陰のリアス海岸を遊覧船で巡る1泊2日、1bd66235)の、
 * 岩井ゆかむり温泉のtransitLeg(前のスポットからの移動)が、旧岩井学校舎を
 * 外したあとも古い値(walk/3分)のまま直っていなかったのをitinerary-audit.cjs
 * が検出した。岩井廃寺塔跡から直接、車で約2分(OSRM実測833m)に直す。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-72-1bd66235-round2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-72-1bd66235-round2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const IWAI_ONSEN_ID = "c0d6958b-c01c-4793-9dc8-bb5b754b41ba"; // 岩井ゆかむり温泉

async function main() {
  const commit = process.argv.includes("--commit");
  const spot = await prisma.spot.findFirstOrThrow({
    where: { id: IWAI_ONSEN_ID },
    include: { transitLegs: true },
  });

  console.log(`[岩井ゆかむり温泉] (id=${spot.id})`);
  console.log("  旧transitLeg:", JSON.stringify(spot.transitLegs));
  console.log("  新transitLeg: car/2分(OSRM実測833m)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({
    where: { id: IWAI_ONSEN_ID },
    data: { transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 2 }] } },
  });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

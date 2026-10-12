/**
 * #160の続き。fix-160bで宝厳寺を挿入した際、椿の湯のvisitTimeを
 * 更新し忘れていた(itinerary-audit「時刻の計算が合わない」)。14:37に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-160c-41d548bb.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "4fa70190-2640-4afc-88af-d2ac7903a436";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const tsubaki = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "椿の湯" } });

  if (tsubaki.visitTime?.getUTCMinutes() === 37) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({ where: { id: tsubaki.id }, data: { visitTime: T(14, 37) } });

  console.log("#160続き: 椿の湯の到着時刻を14:37に修正(直し漏れ)");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

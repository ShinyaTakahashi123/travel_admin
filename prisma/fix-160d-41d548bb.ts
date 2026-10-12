/**
 * #160の続き。椿の湯の時刻修正にともない、ぎやまんガラス美術館の
 * visitTimeも連動して直っていなかった(itinerary-audit「時刻の計算が
 * 合わない」)。15:35に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-160d-41d548bb.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "4fa70190-2640-4afc-88af-d2ac7903a436";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const giyaman = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "ぎやまんガラス美術館" } });

  if (giyaman.visitTime?.getUTCMinutes() === 35) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({ where: { id: giyaman.id }, data: { visitTime: T(15, 35) } });

  console.log("#160続き: ぎやまんガラス美術館の到着時刻を15:35に修正(直し漏れ)");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

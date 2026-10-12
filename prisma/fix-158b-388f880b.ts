/**
 * #158の続き。fix-158でカッパ淵のvisitTimeを更新し忘れていた
 * (itinerary-audit「時刻の計算が合わない」)。10:40に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-158b-388f880b.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "474a27d0-c16e-4db3-939f-db0aecd9ee0f";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const kappabuchi = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "カッパ淵" } });

  if (kappabuchi.visitTime?.getUTCMinutes() === 40) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({ where: { id: kappabuchi.id }, data: { visitTime: T(10, 40) } });

  console.log("#158続き: カッパ淵の到着時刻を10:40に修正(直し漏れ)");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

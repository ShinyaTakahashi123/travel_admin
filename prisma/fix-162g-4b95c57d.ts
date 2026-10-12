/**
 * #162の続き。itinerary-audit.cjsが検出した「時刻の計算が合わない」を
 * 修正。Day2昼食を100分→65分に短縮した際、円覚寺以降のvisitTimeを
 * 正しく更新していなかった(35分短縮したのに15分しか反映されていな
 * かった)。円覚寺以降を正しい時刻に組み直した。
 *
 * 新しい時刻(Day2、09:30〜16:37): 明月院09:30(70)→東慶寺10:47(55)→
 * 昼食11:46(65)→円覚寺12:54(90)→英勝寺14:42(35)→寿福寺15:19(35)→
 * 海蔵寺16:02(35)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-162g-4b95c57d.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY2_ID = "66dbae38-0451-4b6b-87ff-9dc1068d1a1f";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const engakuji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "円覚寺" } });
  const eishoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "英勝寺" } });
  const jufukuji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "寿福寺" } });
  const kaizoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "海蔵寺" } });

  if (engakuji.visitTime?.getUTCHours() === 12 && engakuji.visitTime?.getUTCMinutes() === 54) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({ where: { id: engakuji.id }, data: { visitTime: T(12, 54) } });
  await prisma.spot.update({ where: { id: eishoji.id }, data: { visitTime: T(14, 42) } });
  await prisma.spot.update({ where: { id: jufukuji.id }, data: { visitTime: T(15, 19) } });
  await prisma.spot.update({ where: { id: kaizoji.id }, data: { visitTime: T(16, 2) } });

  console.log("#162続き: Day2の円覚寺以降のvisitTimeを移動時間に合わせて修正(09:30〜16:37)");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

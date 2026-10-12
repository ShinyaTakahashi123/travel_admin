/**
 * #162の続き。itinerary-audit.cjsが検出した「時刻の計算が合わない」を修正。
 * 報国寺の滞在を50分→80分に延ばした際、杉本寺のvisitTimeを更新し忘れて
 * いた(報国寺の終了時刻10:50分がそのまま杉本寺の開始時刻になっていた)。
 * 正しくは報国寺10:50終了+徒歩15分=11:05開始。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-162b-4b95c57d.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "badac21c-fd67-45da-98d3-cff2ec258992";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const sugimotodera = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "杉本寺" } });

  if (sugimotodera.visitTime?.getUTCHours() === 11 && sugimotodera.visitTime?.getUTCMinutes() === 5) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({ where: { id: sugimotodera.id }, data: { visitTime: T(11, 5) } });

  console.log("#162続き: 杉本寺のvisitTimeを11:05に修正(報国寺の滞在延長にあわせて)");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

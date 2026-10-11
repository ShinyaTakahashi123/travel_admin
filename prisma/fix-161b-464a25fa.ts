/**
 * #161の続き。itinerary-audit.cjsが検出した「時刻の計算が合わない」を修正。
 * Day1の昼食(迷路のまちからの徒歩5分を足し忘れ)と中山千枚田(昼食からの
 * 車20分を足し忘れ)のvisitTimeがずれていたのを、後続のオリーブ公園も
 * あわせて正しい時刻に組み直した。
 *
 * 新しい時刻(09:20〜16:36、Day1): 土渕海峡09:20(20)→迷路のまち09:41(100)→
 * 昼食11:26(80)→中山千枚田13:06(40)→小豆島オリーブ公園14:01(155)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-161b-464a25fa.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "322356ed-3fb4-4c5a-afe4-edc2b31855a8";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const kaikyo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "土渕海峡" } });
  const meiro = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "迷路のまち" } });
  const lunch = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "土庄の町で昼食" } });
  const tanada = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "中山千枚田" } });
  const olive = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "小豆島オリーブ公園" } });

  if (lunch.visitTime?.getUTCMinutes() === 26) {
    console.log("already applied, skipping");
    return;
  }

  await setDaySpotOrder(DAY1_ID, [
    { id: kaikyo.id, data: {} },
    { id: meiro.id, data: {} },
    { id: lunch.id, data: { visitTime: T(11, 26) } },
    { id: tanada.id, data: { visitTime: T(13, 6) } },
    { id: olive.id, data: { visitTime: T(14, 1) } },
  ]);

  console.log("#161続き: Day1の昼食・中山千枚田・オリーブ公園のvisitTimeを移動時間に合わせて修正(09:20〜16:36)");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

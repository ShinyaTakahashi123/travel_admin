/**
 * チェックリスト #280 の修正記録(続き、flow-check.cjsの6点自己チェックで発見)。
 * しおり「共同浴場とガス灯の街を味わい尽くす、銀山温泉じっくり1泊2日」
 * (371e874b-267d-4ed0-a3aa-6494df36206c)
 *
 * 1. Day1に昼食の一言がなかった。白銀公園(11:20〜12:25、ちょうど昼どきに
 *    かかる)に、公園入り口周辺で昼食をとる一言を追加。
 * 2. 東根城跡(Day2・旅全体の最後)に帰りの一言がなかったため追加。
 *
 * itinerary-audit.cjs・flow-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-280d-371e874b.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "371e874b-267d-4ed0-a3aa-6494df36206c";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const shirogane = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "白銀公園" } });
  const lunchLine = "公園の入り口周辺には飲食店もあるので、ここで昼食をとりましょう。";
  if (shirogane.memo && !shirogane.memo.includes(lunchLine)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: shirogane.id }, {
      memo: shirogane.memo + " " + lunchLine,
    });
  }

  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 2 } });
  const higashine = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "東根城跡" } });
  const kaeriLine = "見学を終えたら、車で山形市街・山形空港方面へ戻りましょう。";
  if (higashine.memo && !higashine.memo.includes(kaeriLine)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: higashine.id }, {
      memo: higashine.memo + " " + kaeriLine,
    });
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

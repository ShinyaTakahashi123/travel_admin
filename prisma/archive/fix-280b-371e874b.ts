/**
 * チェックリスト #280 の修正記録(続き、itinerary-audit.cjsのセルフチェックで発見)。
 * しおり「共同浴場とガス灯の街を味わい尽くす、銀山温泉じっくり1泊2日」
 * (371e874b-267d-4ed0-a3aa-6494df36206c)
 *
 * fix-280で白銀公園の滞在を30→65分に拡充した際、後続スポットの開始時刻を
 * ずらし忘れていた(「時刻の計算が合わない」)。延沢銀山遺跡以降の時刻を
 * 35分繰り下げて解消。
 *
 * この結果、Day1は8か所09:00〜15:49となる。決まり2(16:30〜17:00)に
 * まだ届いていないが、この区間(尾花沢市街・銀山温泉周辺)でOverpassにより
 * 広く探しても他に実在の行き先が見つからなかったため、企画運営に報告のうえ
 * 判断を仰ぐ。
 *
 * itinerary-audit.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-280b-371e874b.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "371e874b-267d-4ed0-a3aa-6494df36206c";
const shiftMin = 35;
const names = ["延沢銀山遺跡", "大正ロマンの旅館の町並み(能登屋・藤屋ほか)", "しろがね湯", "銀山温泉街"];

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const first = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "延沢銀山遺跡" } });
  if (first.visitTime?.getUTCHours() === 11 && first.visitTime?.getUTCMinutes() === 58) {
    for (const name of names) {
      const row = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name } });
      if (row.visitTime) {
        const newTime = new Date(row.visitTime.getTime() + shiftMin * 60000);
        await updateSpotInItinerary(ITIN_ID, { spotId: row.id }, { visitTime: newTime });
      }
    }
  }

  const allSpots = await prisma.spot.findMany({ where: { dayId: day1.id } });
  for (const s of allSpots) {
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    if (s.transitMode && s.transitDurationMin != null) {
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
      });
    }
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

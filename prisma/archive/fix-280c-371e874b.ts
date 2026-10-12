/**
 * チェックリスト #280 の修正記録(続き、セルフチェックで発見)。
 * しおり「共同浴場とガス灯の街を味わい尽くす、銀山温泉じっくり1泊2日」
 * (371e874b-267d-4ed0-a3aa-6494df36206c)
 *
 * fix-280bで銀山温泉街(Day1の最後)の時刻がずれたままだった。
 * (「銀山温泉街」という名前が複数のしおりにまたがって存在するため、
 * spotIdを直接指定して確実に対象を絞る)
 *
 * itinerary-audit.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-280c-371e874b.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "371e874b-267d-4ed0-a3aa-6494df36206c";
const SPOT_ID = "217b25aa-6004-4730-a271-2531e38315f7";

async function main() {
  const row = await prisma.spot.findUniqueOrThrow({ where: { id: SPOT_ID } });
  if (row.visitTime?.getUTCHours() === 14 && row.visitTime?.getUTCMinutes() === 24) {
    await updateSpotInItinerary(ITIN_ID, { spotId: SPOT_ID }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 59)),
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

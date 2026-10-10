/**
 * チェックリスト #283 の修正記録(見直し)。
 * しおり「坂の上の雲ミュージアムと子規記念博物館、松山文学散歩1泊2日」
 * (3bb9508b-f70c-4cc0-ada9-d4648ecb6571)
 *
 * 本番でDay2の終了が16:28と、決まり2(16:30〜17:00)にわずかに届いていないことが
 * 判明(チェックリストの記録は16:33だったが、本番の実際の値とずれていた)。
 * 2分の差のため、最後の石手寺の滞在を55→60分に微調整して解消(境内に本堂・三重塔・
 * 護摩堂など複数の堂宇がある広い寺院のため、5分の範囲内は妥当と判断)。
 *
 * itinerary-audit.cjs 確認済み。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-283-3bb9508b.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "3bb9508b-f70c-4cc0-ada9-d4648ecb6571";

async function main() {
  const ishite = await findSpotInItinerary(ITIN_ID, { spotName: "石手寺" });
  const row = await prisma.spot.findUniqueOrThrow({ where: { id: ishite.id } });
  if (row.stayDurationMin === 55) {
    await updateSpotInItinerary(ITIN_ID, { spotId: ishite.id }, { stayDurationMin: 60 });
  }
  console.log("done");
}
main().finally(() => prisma.$disconnect());

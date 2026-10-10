/**
 * チェックリスト #280 の修正記録(法務指摘1点)。
 * しおり「共同浴場とガス灯の街を味わい尽くす、銀山温泉じっくり1泊2日」
 * (371e874b-267d-4ed0-a3aa-6494df36206c)
 *
 * 法務の指摘: 和楽足湯の「源泉をそのまま使っているので、温まり方も格別です」
 * が温泉の効き目を言う形になっているため、「源泉をそのまま使っている足湯
 * です」までに短縮。
 *
 * itinerary-audit.cjs・flow-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-280g-371e874b.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "371e874b-267d-4ed0-a3aa-6494df36206c";

async function main() {
  const ashiyu = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "和楽足湯" },
  });
  const oldText = "源泉をそのまま使っているので、温まり方も格別です。";
  const newText = "源泉をそのまま使っている足湯です。";
  if (ashiyu.memo?.includes(oldText)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: ashiyu.id }, {
      memo: ashiyu.memo.replace(oldText, newText),
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

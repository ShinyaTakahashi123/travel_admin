/**
 * チェックリスト #280 の修正記録(法務指摘、文章の整え)。
 * しおり「共同浴場とガス灯の街を味わい尽くす、銀山温泉じっくり1泊2日」
 * (371e874b-267d-4ed0-a3aa-6494df36206c)
 *
 * 法務の指摘: 和楽足湯の本文で「足湯です。」が2文続いていたため、1文に
 * まとめて整えた。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-280h-371e874b.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "371e874b-267d-4ed0-a3aa-6494df36206c";

async function main() {
  const ashiyu = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "和楽足湯" },
  });
  const oldText = "和楽足湯は、温泉街の入り口、銀山川のほとりにある足湯です。源泉をそのまま使っている足湯です。";
  const newText = "和楽足湯は、温泉街の入り口、銀山川のほとりにある足湯で、源泉をそのまま使っています。";
  if (ashiyu.memo?.includes(oldText)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: ashiyu.id }, {
      memo: ashiyu.memo.replace(oldText, newText),
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

/**
 * チェックリスト #294 の修正記録(見直し2の続き、itinerary-audit.cjsのセルフチェックで発見)。
 * しおり「三朝川の河原風呂、野趣あふれる混浴露天と温泉街1泊2日」
 * (476fb1d7-5930-48de-894f-98a40c9f9333)
 *
 * 陣所の館の本文に「毎年5月4日に」という具体的な日付と、「入場無料」という
 * 料金の記載があり、決まり9(具体的な日付・料金は書かない)に反していた。
 * 「毎年5月ごろ」に修正し、「入場無料」は削除。
 *
 * itinerary-audit.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-294d-476fb1d7.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "476fb1d7-5930-48de-894f-98a40c9f9333";

async function main() {
  const jinsho = await findSpotInItinerary(ITIN_ID, { spotName: "陣所の館" });
  const row = await prisma.spot.findUniqueOrThrow({ where: { id: jinsho.id } });
  if (row.memo?.includes("入場無料")) {
    await updateSpotInItinerary(ITIN_ID, { spotId: jinsho.id }, {
      memo: row.memo
        .replace("入場無料の資料館", "資料館")
        .replace("毎年5月4日に行われる", "毎年5月ごろに行われる"),
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

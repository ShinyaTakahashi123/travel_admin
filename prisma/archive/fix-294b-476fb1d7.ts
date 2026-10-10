/**
 * チェックリスト #294 の修正記録(見直しの続き、法務の指摘)。
 * しおり「三朝川の河原風呂、野趣あふれる混浴露天と温泉街1泊2日」
 * (476fb1d7-5930-48de-894f-98a40c9f9333)
 *
 * 三朝神社の「『神の湯』と呼ばれるこの水は、健康を願って飲むこともできます」
 * が、温泉の効能に近い言い方だったため、「手水舎には温泉水が引かれていて、
 * 『神の湯』と呼ばれています」までに修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-294b-476fb1d7.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "476fb1d7-5930-48de-894f-98a40c9f9333";

async function main() {
  const jinja = await findSpotInItinerary(ITIN_ID, { spotName: "三朝神社" });
  const row = await prisma.spot.findUniqueOrThrow({ where: { id: jinja.id } });
  const oldText = "手水舎には温泉水が引かれており、「神の湯」と呼ばれるこの水は、健康を願って飲むこともできます。";
  if (row.memo?.includes(oldText)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: jinja.id }, {
      memo: row.memo.replace(oldText, "手水舎には温泉水が引かれていて、「神の湯」と呼ばれています。"),
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

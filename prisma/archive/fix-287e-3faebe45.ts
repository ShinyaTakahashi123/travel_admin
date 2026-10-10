/**
 * チェックリスト #287 の修正記録(5巡目、flow-check.cjsのセルフチェックで発見)。
 * しおり「筑波山の絶景をケーブルカーとロープウェイで、山麓の宿に泊まる1泊2日プラン」
 * (3faebe45-b4a5-4861-a8a8-78532fb6210d)
 *
 * つくばエキスポセンターの書き出しが「平沢官衙遺跡からは車で20分ほどです」のまま
 * 残っていた(fix-287cで地図と測量の科学館を間に挿入した際の取りこぼし)。
 * 「地図と測量の科学館からは車で7分ほどです」に修正。
 *
 * itinerary-audit.cjs・flow-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-287e-3faebe45.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "3faebe45-b4a5-4861-a8a8-78532fb6210d";

async function main() {
  const spot = await findSpotInItinerary(ITIN_ID, { spotName: "つくばエキスポセンター" });
  const row = await prisma.spot.findUniqueOrThrow({ where: { id: spot.id } });
  if (row.memo?.startsWith("平沢官衙遺跡からは")) {
    await updateSpotInItinerary(ITIN_ID, { spotId: spot.id }, {
      memo: row.memo.replace("平沢官衙遺跡からは車で20分ほどです。", "地図と測量の科学館からは車で7分ほどです。"),
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

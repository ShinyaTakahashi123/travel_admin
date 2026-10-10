/**
 * チェックリスト #287 の修正記録(見直し2の続き2、セルフチェックで発見)。
 * しおり「筑波山の絶景をケーブルカーとロープウェイで、山麓の宿に泊まる1泊2日プラン」
 * (3faebe45-b4a5-4861-a8a8-78532fb6210d)
 *
 * 1. fix-287gで筑波山ケーブルカーの移動時間を22分に直したが、ケーブルカー自身の
 *    開始時刻をずらし忘れ、「時刻の計算が合わない(間10分/移動22分)」になっていた。
 *    ケーブルカー以降の全スポットの開始時刻を12分繰り下げて解消。
 *
 * 2. flow-check.cjsで、地質標本館(Day2で最後ではなくなった)の本文に
 *    「1泊2日の旅の締めくくりに、地球の成り立ちに思いをはせてみましょう。」という
 *    締めの表現が途中に残っているのを発見。この一文を削除。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-287h-3faebe45.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "3faebe45-b4a5-4861-a8a8-78532fb6210d";

async function main() {
  const shiftMin = 12;
  const names = ["筑波山ケーブルカー", "御幸ヶ原", "男体山山頂", "女体山山頂", "弁慶七戻り", "筑波山ロープウェイ", "つつじヶ丘公園"];
  const cable = await findSpotInItinerary(ITIN_ID, { spotName: "筑波山ケーブルカー" });
  const cableRow = await prisma.spot.findUniqueOrThrow({ where: { id: cable.id } });
  if (cableRow.visitTime?.getUTCHours() === 11 && cableRow.visitTime?.getUTCMinutes() === 10) {
    for (const name of names) {
      const spot = await findSpotInItinerary(ITIN_ID, { spotName: name });
      const row = await prisma.spot.findUniqueOrThrow({ where: { id: spot.id } });
      if (row.visitTime) {
        const newTime = new Date(row.visitTime.getTime() + shiftMin * 60000);
        await updateSpotInItinerary(ITIN_ID, { spotId: spot.id }, { visitTime: newTime });
      }
    }
  }

  const chishitsu = await findSpotInItinerary(ITIN_ID, { spotName: "地質標本館" });
  const chishitsuRow = await prisma.spot.findUniqueOrThrow({ where: { id: chishitsu.id } });
  const shimekukuri = "1泊2日の旅の締めくくりに、地球の成り立ちに思いをはせてみましょう。";
  if (chishitsuRow.memo?.includes(shimekukuri)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: chishitsu.id }, {
      memo: chishitsuRow.memo.replace(" " + shimekukuri, "").replace(shimekukuri, ""),
    });
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

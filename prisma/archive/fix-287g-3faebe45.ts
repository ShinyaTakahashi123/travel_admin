/**
 * チェックリスト #287 の修正記録(見直し2の続き、itinerary-audit.cjsのセルフチェックで発見)。
 * しおり「筑波山の絶景をケーブルカーとロープウェイで、山麓の宿に泊まる1泊2日プラン」
 * (3faebe45-b4a5-4861-a8a8-78532fb6210d)
 *
 * fix-287fで筑波山梅林→筑波山ケーブルカーの移動を徒歩10分としたが、実際の座標間
 * 距離は1.6kmあり、itinerary-audit.cjsで「徒歩が速すぎ 1.6km/10分」と指摘された。
 * 実際の距離に見合う徒歩22分に修正し、後続の時刻も調整。
 *
 * itinerary-audit.cjs・flow-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-287g-3faebe45.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "3faebe45-b4a5-4861-a8a8-78532fb6210d";

async function main() {
  const cable = await findSpotInItinerary(ITIN_ID, { spotName: "筑波山ケーブルカー" });
  const cableRow = await prisma.spot.findUniqueOrThrow({ where: { id: cable.id } });
  if (cableRow.transitDurationMin === 10) {
    await updateSpotInItinerary(ITIN_ID, { spotId: cable.id }, {
      transitDurationMin: 22,
      memo: cableRow.memo!.replace("筑波山梅林からは歩いて10分ほどで、", "筑波山梅林からは歩いて22分ほどで、"),
    });
  }

  // 後続の時刻を12分ずつ繰り下げ(御幸ヶ原〜つつじヶ丘公園)
  const shiftMin = 12;
  const names = ["御幸ヶ原", "男体山山頂", "女体山山頂", "弁慶七戻り", "筑波山ロープウェイ", "つつじヶ丘公園"];
  for (const name of names) {
    const spot = await findSpotInItinerary(ITIN_ID, { spotName: name });
    const row = await prisma.spot.findUniqueOrThrow({ where: { id: spot.id } });
    if (row.visitTime) {
      const newTime = new Date(row.visitTime.getTime() + shiftMin * 60000);
      await updateSpotInItinerary(ITIN_ID, { spotId: spot.id }, { visitTime: newTime });
    }
  }

  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
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

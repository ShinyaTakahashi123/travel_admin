/**
 * チェックリスト #283 の修正記録(4巡目、itinerary-audit.cjsのセルフチェックで発見)。
 * しおり「坂の上の雲ミュージアムと子規記念博物館、松山文学散歩1泊2日」
 * (3bb9508b-f70c-4cc0-ada9-d4648ecb6571)
 *
 * fix-283c で並びを変えた際の2つの取りこぼしを自分で発見して修正:
 * 1. 放生園の書き出しが「道後温泉本館からは歩いて5分ほどです」のまま残っていた
 *    (新しい並びでは直前は宝厳寺)。「宝厳寺からは歩いて5分ほどです」に修正。
 * 2. 放生園→湯築城跡の移動時間15分は、itinerary-audit.cjsで
 *    「徒歩が遅すぎ(水増し?) 0.3km/15分」と指摘された。実際の直線距離0.3kmに
 *    見合う徒歩5分に修正。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-283d-3bb9508b.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "3bb9508b-f70c-4cc0-ada9-d4648ecb6571";

async function main() {
  const hojoen = await findSpotInItinerary(ITIN_ID, { spotName: "放生園" });
  const hojoenRow = await prisma.spot.findUniqueOrThrow({ where: { id: hojoen.id } });
  if (hojoenRow.memo?.startsWith("道後温泉本館からは")) {
    await updateSpotInItinerary(ITIN_ID, { spotId: hojoen.id }, {
      memo: hojoenRow.memo.replace("道後温泉本館からは歩いて5分ほどです。", "宝厳寺からは歩いて5分ほどです。"),
    });
  }

  const yuzukijo = await findSpotInItinerary(ITIN_ID, { spotName: "湯築城跡" });
  const yuzukijoRow = await prisma.spot.findUniqueOrThrow({ where: { id: yuzukijo.id } });
  if (yuzukijoRow.transitDurationMin === 15) {
    await updateSpotInItinerary(ITIN_ID, { spotId: yuzukijo.id }, {
      transitDurationMin: 5,
      visitTime: new Date(Date.UTC(1970, 0, 1, 13, 3)),
    });
  }

  // 後続スポットの時刻も詰める(湯築城跡の到着が10分早まったため)
  const shikihaku = await findSpotInItinerary(ITIN_ID, { spotName: "松山市立子規記念博物館" });
  const shikihakuRow = await prisma.spot.findUniqueOrThrow({ where: { id: shikihaku.id } });
  if (shikihakuRow.visitTime?.getUTCHours() === 14 && shikihakuRow.visitTime?.getUTCMinutes() === 13) {
    await updateSpotInItinerary(ITIN_ID, { spotId: shikihaku.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 3)),
    });
  }

  const ishite = await findSpotInItinerary(ITIN_ID, { spotName: "石手寺" });
  const ishiteRow = await prisma.spot.findUniqueOrThrow({ where: { id: ishite.id } });
  if (ishiteRow.visitTime?.getUTCHours() === 15 && ishiteRow.visitTime?.getUTCMinutes() === 43) {
    await updateSpotInItinerary(ITIN_ID, { spotId: ishite.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 33)),
    });
  }

  // SpotTransitLegを同期
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 2 } });
  const allSpots = await prisma.spot.findMany({ where: { dayId: day2.id } });
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

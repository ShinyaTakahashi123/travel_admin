/**
 * チェックリスト #287 の修正記録(2巡目、itinerary-audit.cjsのセルフチェックで発見)。
 * しおり「筑波山の絶景をケーブルカーとロープウェイで、山麓の宿に泊まる1泊2日プラン」
 * (3faebe45-b4a5-4861-a8a8-78532fb6210d)
 *
 * fix-287で追加したつつじヶ丘公園への移動(徒歩3分)が、itinerary-audit.cjsで
 * 「徒歩が速すぎ 0.6km/3分」と指摘された。筑波山ロープウェイのスポット座標は
 * 山頂側(女体山駅)の点のため、山麓側のつつじヶ丘公園までの直線距離は徒歩ではなく
 * ロープウェイでの下山にあたる。御幸ヶ原(ケーブルカーでの到着)が transit:null と
 * 同じ扱いになっているのにならい、つつじヶ丘公園の移動もtransit:nullに修正
 * (ロープウェイでの下山は筑波山ロープウェイ自身の本文で説明済み)。
 *
 * itinerary-audit.cjs・flow-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-287b-3faebe45.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "3faebe45-b4a5-4861-a8a8-78532fb6210d";

async function main() {
  const spot = await findSpotInItinerary(ITIN_ID, { spotName: "つつじヶ丘公園" });
  const row = await prisma.spot.findUniqueOrThrow({ where: { id: spot.id } });
  if (row.transitMode === "walk") {
    await updateSpotInItinerary(ITIN_ID, { spotId: spot.id }, { transitMode: null, transitDurationMin: null });
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: spot.id } });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

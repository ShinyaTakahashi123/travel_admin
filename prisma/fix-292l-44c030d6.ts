/**
 * チェックリスト #292 の修正記録(見直し4の続き、セルフチェックで発見)。
 * しおり「蔵王のお釜と高湯通り、火山と温泉街をめぐる蔵王1泊2日」
 * (44c030d6-8683-4c99-84eb-96159b2ce14b)
 *
 * fix-292kで蔵王ロープウェイの滞在を90→45分に短縮したが、蔵王地蔵尊の開始
 * 時刻をずらし忘れていた(「時刻の計算が合わない」)。蔵王地蔵尊11:53開始に
 * 修正し、高湯通り以降の時刻も詰める。
 *
 * itinerary-audit.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-292l-44c030d6.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "44c030d6-8683-4c99-84eb-96159b2ce14b";

async function main() {
  const jizo = await findSpotInItinerary(ITIN_ID, { spotName: "蔵王地蔵尊" });
  const jizoRow = await prisma.spot.findUniqueOrThrow({ where: { id: jizo.id } });
  if (jizoRow.visitTime?.getUTCHours() === 12 && jizoRow.visitTime?.getUTCMinutes() === 38) {
    await updateSpotInItinerary(ITIN_ID, { spotId: jizo.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 11, 53)),
    });
  }
  const takayu = await findSpotInItinerary(ITIN_ID, { spotName: "高湯通り" });
  const takayuRow = await prisma.spot.findUniqueOrThrow({ where: { id: takayu.id } });
  if (takayuRow.visitTime?.getUTCHours() === 13 && takayuRow.visitTime?.getUTCMinutes() === 14) {
    await updateSpotInItinerary(ITIN_ID, { spotId: takayu.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 13, 14)),
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

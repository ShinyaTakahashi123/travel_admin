/**
 * チェックリスト #292 の修正記録(見直しの続き4)。
 * しおり「蔵王のお釜と高湯通り、火山と温泉街をめぐる蔵王1泊2日」
 * (44c030d6-8683-4c99-84eb-96159b2ce14b)
 *
 * fix-292dで湯女石(記念碑群)の座標を修正しようとしたが、Spot.lat/lngが
 * Prisma Decimal型のため、素の数値との厳密等価比較(===)が常にfalseになり、
 * 更新がスキップされていた。座標(38.167871,140.39601、高湯通りの実際の値)
 * に直接更新する。
 *
 * itinerary-audit.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-292e-44c030d6.ts
 * (実行済み。目的の値であれば何もしないため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "44c030d6-8683-4c99-84eb-96159b2ce14b";

async function main() {
  const yumeishi = await findSpotInItinerary(ITIN_ID, { spotName: "湯女石(記念碑群)" });
  const row = await prisma.spot.findUniqueOrThrow({ where: { id: yumeishi.id } });
  if (row.lat?.toNumber() !== 38.167871) {
    await updateSpotInItinerary(ITIN_ID, { spotId: yumeishi.id }, { lat: 38.167871, lng: 140.39601 });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

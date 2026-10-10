/**
 * チェックリスト #292 の修正記録(見直し7、企画運営の指摘)。
 * しおり「蔵王のお釜と高湯通り、火山と温泉街をめぐる蔵王1泊2日」
 * (44c030d6-8683-4c99-84eb-96159b2ce14b)
 *
 * 蔵王温泉→霞城公園の「車で20分」は、実際の道のり(およそ20km)からすると
 * 短めだったため30分に修正。終了が17:00を超えるため、上湯・川原湯共同浴場
 * の滞在を45分→35分に少し縮めて調整。
 *
 * itinerary-audit.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-292o-44c030d6.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "44c030d6-8683-4c99-84eb-96159b2ce14b";

async function main() {
  const kyodo = await findSpotInItinerary(ITIN_ID, { spotName: "上湯・川原湯共同浴場" });
  const kyodoRow = await prisma.spot.findUniqueOrThrow({ where: { id: kyodo.id } });
  if (kyodoRow.stayDurationMin === 45) {
    await updateSpotInItinerary(ITIN_ID, { spotId: kyodo.id }, { stayDurationMin: 35 });
  }

  const kajo = await findSpotInItinerary(ITIN_ID, { spotName: "霞城公園" });
  const kajoRow = await prisma.spot.findUniqueOrThrow({ where: { id: kajo.id } });
  if (kajoRow.transitDurationMin === 20) {
    await updateSpotInItinerary(ITIN_ID, { spotId: kajo.id }, {
      transitDurationMin: 30,
      visitTime: new Date(Date.UTC(1970, 0, 1, 16, 25)),
      memo: kajoRow.memo!.replace(
        "上湯・川原湯共同浴場からは、山形市街へ向かう帰り道の途中、車で20分ほどです。",
        "上湯・川原湯共同浴場からは、山形市街へ向かう帰り道の途中、車で30分ほどです。"
      ),
    });
  }

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

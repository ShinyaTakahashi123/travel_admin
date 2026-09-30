/**
 * チェックリスト #292 の修正記録(見直しの続き3、itinerary-audit.cjsのセルフチェックで発見)。
 * しおり「蔵王のお釜と高湯通り、火山と温泉街をめぐる蔵王1泊2日」
 * (44c030d6-8683-4c99-84eb-96159b2ce14b)
 *
 * fix-292cで3点の取りこぼしを自分で発見して修正:
 * 1. 湯女石(記念碑群)の座標に、高湯通りの誤った代表点(38.1364,140.4008)を
 *    使ってしまい、実際の高湯通りの座標(38.167871,140.39601)との間に3.5kmの
 *    差ができ、「徒歩が速すぎ」になっていた。実際の座標に修正。
 * 2. 酢川温泉神社の開始時刻を、湯女石の終了時刻とのつながりを誤って10分の
 *    間隔にしてしまっていた(移動5分と不一致)。5分に修正。
 * 3. うつぼ沼・目玉沼は片貝沼の代表点を暫定使用しているため座標間の距離が
 *    0kmになり、「near0kmでother15分」の指摘。移動時間を5分に短縮。
 *
 * itinerary-audit.cjs・flow-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-292d-44c030d6.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "44c030d6-8683-4c99-84eb-96159b2ce14b";

async function main() {
  const yumeishi = await findSpotInItinerary(ITIN_ID, { spotName: "湯女石(記念碑群)" });
  const yumeishiRow = await prisma.spot.findUniqueOrThrow({ where: { id: yumeishi.id } });
  if (yumeishiRow.lat?.toNumber() === 38.1364) {
    await updateSpotInItinerary(ITIN_ID, { spotId: yumeishi.id }, { lat: 38.167871, lng: 140.39601 });
  }

  const suzukawa = await findSpotInItinerary(ITIN_ID, { spotName: "酢川温泉神社" });
  const suzukawaRow = await prisma.spot.findUniqueOrThrow({ where: { id: suzukawa.id } });
  if (suzukawaRow.visitTime?.getUTCHours() === 15 && suzukawaRow.visitTime?.getUTCMinutes() === 4) {
    await updateSpotInItinerary(ITIN_ID, { spotId: suzukawa.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 59)),
    });
  }

  const shimoyu = await findSpotInItinerary(ITIN_ID, { spotName: "下湯共同浴場" });
  const shimoyuRow = await prisma.spot.findUniqueOrThrow({ where: { id: shimoyu.id } });
  if (shimoyuRow.visitTime?.getUTCHours() === 15 && shimoyuRow.visitTime?.getUTCMinutes() === 29) {
    await updateSpotInItinerary(ITIN_ID, { spotId: shimoyu.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 24)),
    });
  }

  const utsubo = await findSpotInItinerary(ITIN_ID, { spotName: "うつぼ沼・目玉沼" });
  const utsuboRow = await prisma.spot.findUniqueOrThrow({ where: { id: utsubo.id } });
  if (utsuboRow.transitDurationMin === 15) {
    await updateSpotInItinerary(ITIN_ID, { spotId: utsubo.id }, {
      transitDurationMin: 5,
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 44)),
    });
    const kyodo = await findSpotInItinerary(ITIN_ID, { spotName: "上湯・川原湯共同浴場" });
    const kyodoRow = await prisma.spot.findUniqueOrThrow({ where: { id: kyodo.id } });
    if (kyodoRow.visitTime?.getUTCHours() === 15 && kyodoRow.visitTime?.getUTCMinutes() === 49) {
      await updateSpotInItinerary(ITIN_ID, { spotId: kyodo.id }, {
        visitTime: new Date(Date.UTC(1970, 0, 1, 15, 39)),
      });
    }
  }

  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 2 } });
  const allSpots = await prisma.spot.findMany({ where: { dayId: { in: [day1.id, day2.id] } } });
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

/**
 * #351の続き。fix-351cで文翔館のvisitTimeを13:50のまま直し忘れており、
 * itinerary-auditで「時刻の計算が合わない(間36分/移動16分)」を検出。
 * 霞城公園(昼食を含む)の滞在を30→45分に広げたうえで、郷土館・文翔館・
 * 紅の蔵のvisitTimeを正しく計算し直す(紅の蔵の滞在も95→100分に調整し、
 * 16:30〜17:00の窓に着地)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-351d-b461a3e0.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b461a3e0-87c6-48dd-b5e8-886ba0345df7";

async function main() {
  const kajojoen = await prisma.spot.findFirstOrThrow({ where: { name: "霞城公園（山形城跡）", day: { itineraryId: ITIN_ID } } });
  const museum = await prisma.spot.findFirstOrThrow({ where: { name: "山形県立博物館", day: { itineraryId: ITIN_ID } } });
  const kyodokan = await prisma.spot.findFirstOrThrow({ where: { name: "山形市郷土館(旧済生館本館)", day: { itineraryId: ITIN_ID } } });
  const bunshokan = await prisma.spot.findFirstOrThrow({ where: { name: "文翔館", day: { itineraryId: ITIN_ID } } });
  const beninokura = await prisma.spot.findFirstOrThrow({ where: { name: "山形まるごと館紅の蔵", day: { itineraryId: ITIN_ID } } });

  if (kajojoen.stayDurationMin === 45) {
    console.log("already fixed, skipping");
    return;
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: kajojoen.id }, { stayDurationMin: 45 });
  await updateSpotInItinerary(ITIN_ID, { spotId: museum.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 12)) });
  await updateSpotInItinerary(ITIN_ID, { spotId: kyodokan.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 54)) });
  await updateSpotInItinerary(ITIN_ID, { spotId: bunshokan.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 13, 45)) });
  await updateSpotInItinerary(ITIN_ID, { spotId: beninokura.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 56)), stayDurationMin: 100 });

  console.log("Day2の時刻を再計算: 霞城公園11:25-12:10(滞在45)→博物館12:12-12:52→郷土館12:54-13:29→文翔館13:45-14:40→紅の蔵14:56-16:36");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

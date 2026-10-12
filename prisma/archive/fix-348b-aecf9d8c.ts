/**
 * #348の続き。itinerary-auditで草千里ヶ浜→阿蘇火山博物館の徒歩が
 * 0.5km/3分で速すぎる(⚠)。6分に直し、後続のvisitTimeも再計算する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-348b-aecf9d8c.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "aecf9d8c-3848-46e0-bed7-131c1c98851d";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const museum = await prisma.spot.findFirstOrThrow({ where: { name: "阿蘇火山博物館", day: { itineraryId: ITIN_ID } } });
  if (museum.transitDurationMin === 6) {
    console.log("already fixed, skipping");
    return;
  }

  const museumOld = "草千里ヶ浜からは、歩いておよそ3分です。";
  const museumNext = "草千里ヶ浜からは、歩いておよそ6分です。";
  if (!museum.memo?.includes(museumOld)) throw new Error("museum anchor not found");

  await updateSpotInItinerary(
    ITIN_ID,
    { spotId: museum.id },
    { transitDurationMin: 6, visitTime: t(10, 26), memo: museum.memo.replace(museumOld, museumNext) }
  );
  console.log("museum transit fixed to 6min, visitTime shifted to 10:26");

  const komezuka = await prisma.spot.findFirstOrThrow({ where: { name: "米塚", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: komezuka.id }, { visitTime: t(11, 12) });
  const nakadake = await prisma.spot.findFirstOrThrow({ where: { name: "阿蘇山上（中岳火口）", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: nakadake.id }, { visitTime: t(11, 45) });
  const jinja = await prisma.spot.findFirstOrThrow({ where: { name: "阿蘇神社", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: jinja.id }, { visitTime: t(12, 42) });
  const daikanbo = await prisma.spot.findFirstOrThrow({ where: { name: "大観峰", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: daikanbo.id }, { visitTime: t(14, 14) });
  const uchinomaki = await prisma.spot.findFirstOrThrow({ where: { name: "内牧温泉", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: uchinomaki.id }, { visitTime: t(15, 18) });
  console.log("cascade updated for all downstream spots (+3min)");

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

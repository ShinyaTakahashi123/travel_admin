import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "../prisma/lib/spot-lookup";
const ITIN_ID = "9d8e49e5-829f-44b3-b59f-8a8de36db689";
async function main() {
  const kongobuji = await prisma.spot.findFirstOrThrow({ where: { name: "金剛峯寺", day: { itineraryId: ITIN_ID } } });
  if (kongobuji.transitDurationMin !== 7) {
    await updateSpotInItinerary(ITIN_ID, { spotId: kongobuji.id }, { transitDurationMin: 7 });
    console.log("kongobuji transitDurationMin 5->7");
  } else {
    console.log("already 7");
  }
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

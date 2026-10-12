import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "../prisma/lib/spot-lookup";
const ITIN_ID = "9d4badcb-ec4d-4eaf-97af-b173d3d4ff5d";
async function main() {
  const kenchuji = await prisma.spot.findFirstOrThrow({ where: { name: "建中寺", day: { itineraryId: ITIN_ID } } });
  const target = new Date(Date.UTC(1970, 0, 1, 13, 30));
  if (kenchuji.visitTime?.getTime() !== target.getTime()) {
    await updateSpotInItinerary(ITIN_ID, { spotId: kenchuji.id }, { visitTime: target });
    console.log("kenchuji visitTime -> 13:30");
  } else {
    console.log("already 13:30");
  }
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

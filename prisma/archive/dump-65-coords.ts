import { prisma } from "../src/lib/prisma";

const ITIN = "1bd66235-42eb-4312-a2c0-d013aba8775f";

async function main() {
  const days = await prisma.day.findMany({ where: { itineraryId: ITIN }, include: { spots: true } });
  for (const d of days) {
    for (const s of d.spots) {
      if (["城原海岸", "浦富海岸 田後港"].includes(s.name)) {
        console.log(s.name, s.lat, s.lng, "dur=", s.transitDurationMin, "mode=", s.transitMode);
      }
    }
  }
}
main();

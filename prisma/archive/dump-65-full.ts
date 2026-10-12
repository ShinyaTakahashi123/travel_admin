import { prisma } from "../src/lib/prisma";

const ITIN = "1bd66235-42eb-4312-a2c0-d013aba8775f";

async function main() {
  const days = await prisma.day.findMany({
    where: { itineraryId: ITIN },
    orderBy: { dayNumber: "asc" },
    include: { spots: { orderBy: { visitTime: "asc" } } },
  });
  for (const d of days) {
    console.log(`\n########## Day${d.dayNumber} ##########`);
    for (const s of d.spots) {
      console.log(`\n--- ${s.name} (mode=${s.transitMode} dur=${s.transitDurationMin}) ---\n${s.memo}`);
    }
  }
}
main();

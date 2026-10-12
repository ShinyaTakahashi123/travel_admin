import { prisma } from "../src/lib/prisma";

const ITIN = "55a33667-b603-4efa-ad4f-2b5f8e8e2f47";

function hm(d: Date) {
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

async function main() {
  const days = await prisma.day.findMany({
    where: { itineraryId: ITIN },
    orderBy: { dayNumber: "asc" },
    include: { spots: { orderBy: { visitTime: "asc" } } },
  });
  for (const d of days) {
    console.log(`\n-- Day${d.dayNumber} (id=${d.id}) --`);
    for (const s of d.spots) {
      console.log(`${s.name} id=${s.id} visit=${hm(s.visitTime!)} stay=${s.stayDurationMin} lat=${s.lat} lng=${s.lng} mode=${s.transitMode} tdur=${s.transitDurationMin}`);
    }
  }
}
main().finally(() => prisma.$disconnect());

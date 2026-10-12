import { prisma } from "../src/lib/prisma";

const ITIN = "357983ef-fff3-496a-8a92-1f236f8f24bd";

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
      console.log(`${s.name} id=${s.id} visit=${hm(s.visitTime!)} stay=${s.stayDurationMin} lat=${s.lat} lng=${s.lng}`);
    }
  }
}
main().finally(() => prisma.$disconnect());

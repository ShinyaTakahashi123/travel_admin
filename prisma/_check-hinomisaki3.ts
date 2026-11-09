import { prisma } from "../src/lib/prisma";

async function main() {
  const spots = await prisma.spot.findMany({
    where: { day: { itineraryId: "33100ce1-b739-4342-826f-4de81880d252" } },
    orderBy: { orderNo: "asc" },
    include: { transitLegs: { orderBy: { orderNo: "asc" } }, day: true },
  });
  for (const s of spots) {
    console.log(`\n[day=${s.day.dayNumber} orderNo=${s.orderNo}] ${s.name}`);
    console.log(`  lat=${s.lat} lng=${s.lng} stay=${s.stayDurationMin}`);
    console.log(`  memo=${s.memo}`);
  }
}
main().finally(() => prisma.$disconnect());

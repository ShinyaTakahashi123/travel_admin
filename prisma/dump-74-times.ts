import { prisma } from "../src/lib/prisma";

function hm(d: Date) {
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6dc83721%'`);
  const itinId = rows[0].id;
  const days = await prisma.day.findMany({ where: { itineraryId: itinId }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { visitTime: "asc" } } } });
  for (const d of days) {
    console.log(`-- Day${d.dayNumber} (id=${d.id}) --`);
    for (const s of d.spots) console.log(s.name, s.id, s.lat, s.lng, hm(s.visitTime!), s.stayDurationMin);
  }
}
main().finally(() => prisma.$disconnect());

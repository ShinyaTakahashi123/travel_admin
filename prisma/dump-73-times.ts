import { prisma } from "../src/lib/prisma";

function hm(d: Date) {
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

async function main() {
  const itin = await prisma.$queryRawUnsafe<any[]>(`select id::text from itinerary where id::text like '6062ae58%'`);
  const id = itin[0].id;
  const days = await prisma.day.findMany({ where: { itineraryId: id }, include: { spots: { orderBy: { visitTime: "asc" } } } });
  for (const d of days) {
    for (const s of d.spots) console.log(s.name, s.id, s.lat, s.lng, hm(s.visitTime), s.stayDurationMin);
  }
}
main().finally(() => prisma.$disconnect());

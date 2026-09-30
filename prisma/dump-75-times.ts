import { prisma } from "../src/lib/prisma";

function hm(d: Date) {
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '7b69bad5%'`);
  const itinId = rows[0].id;
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: itinId } }, orderBy: { visitTime: "asc" } });
  for (const s of spots) console.log(s.name, s.id, s.lat, s.lng, hm(s.visitTime), s.stayDurationMin, s.transitMode, s.transitDurationMin);
}
main().finally(() => prisma.$disconnect());

import { prisma } from "../src/lib/prisma";

const ITIN = "1d0aa24f-a0e8-4319-b97b-86952764c785";

function hm(d: Date) {
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITIN } }, orderBy: { visitTime: "asc" } });
  for (const s of spots) console.log(`${s.name} id=${s.id} visit=${hm(s.visitTime)} stay=${s.stayDurationMin} lat=${s.lat} lng=${s.lng} mode=${s.transitMode} tdur=${s.transitDurationMin}`);
}
main().finally(() => prisma.$disconnect());

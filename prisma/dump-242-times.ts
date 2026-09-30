import { prisma } from "../src/lib/prisma";

const ITIN = "0c542f79-2811-4a59-bfcb-34816ad72c3e";

function hm(d: Date) {
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN } });
  console.log("nights=", (itin as any).nights);
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITIN } }, orderBy: { visitTime: "asc" } });
  for (const s of spots) console.log(`${s.name} visit=${hm(s.visitTime)} stay=${s.stayDurationMin}`);
}
main().finally(() => prisma.$disconnect());

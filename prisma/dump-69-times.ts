import { prisma } from "../src/lib/prisma";

const ITIN = "4124d576-4cd8-4086-b61e-9cd8a9576115";

function hm(d: Date) {
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITIN } }, orderBy: { visitTime: "asc" } });
  for (const s of spots) console.log(`${s.name} id=${s.id} visit=${hm(s.visitTime)} stay=${s.stayDurationMin} mode=${s.transitMode} tdur=${s.transitDurationMin}`);
}
main().finally(() => prisma.$disconnect());

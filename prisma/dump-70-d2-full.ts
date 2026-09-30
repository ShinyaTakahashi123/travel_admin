import { prisma } from "../src/lib/prisma";

function hm(d: Date) {
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

async function main() {
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: "47214a80-9c61-4b42-bc92-b382de9581eb", dayNumber: 2 }, include: { spots: { orderBy: { visitTime: "asc" } } } });
  for (const s of day2.spots) console.log(`${s.name} visit=${hm(s.visitTime)} stay=${s.stayDurationMin} mode=${s.transitMode} tdur=${s.transitDurationMin}`);
}
main().finally(() => prisma.$disconnect());

import { prisma } from "../src/lib/prisma";

const ITIN = "2fd67b8b-59c6-4ea4-ab01-b27e2414a53e";

function hm(d: Date) {
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

async function main() {
  const day = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN, dayNumber: 2 }, include: { spots: { orderBy: { visitTime: "asc" } } } });
  console.log("dayId=", day.id);
  for (const s of day.spots) {
    console.log(`${s.name} id=${s.id} visit=${hm(s.visitTime!)} stay=${s.stayDurationMin} mode=${s.transitMode} tdur=${s.transitDurationMin}`);
  }
}
main().finally(() => prisma.$disconnect());

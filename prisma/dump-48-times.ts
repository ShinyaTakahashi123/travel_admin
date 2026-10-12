import { prisma } from "../src/lib/prisma";

const ITIN = "1a76df9e-e99a-47e0-bbe8-fb01fbe2365b";

function hm(d: Date) {
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITIN } }, orderBy: { visitTime: "asc" } });
  for (const s of spots) console.log(`${s.name} visit=${hm(s.visitTime!)} stay=${s.stayDurationMin}`);
  const last = await prisma.spot.findUniqueOrThrow({ where: { id: "d8133591-5557-4e74-a92f-45f8d040d001" } });
  console.log(`\n=== ${last.name} ===\n${last.memo}`);
}
main().finally(() => prisma.$disconnect());

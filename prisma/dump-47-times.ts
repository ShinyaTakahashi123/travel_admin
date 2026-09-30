import { prisma } from "../src/lib/prisma";

const ITIN = "0928e88e-380c-4702-9559-af6252822245";

function hm(d: Date) {
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITIN } }, orderBy: { visitTime: "asc" } });
  for (const s of spots) console.log(`${s.name} visit=${hm(s.visitTime)} stay=${s.stayDurationMin}`);
  const last = await prisma.spot.findUniqueOrThrow({ where: { id: "fabf67b8-b747-455a-86cf-6917581e7f68" } });
  console.log(`\n=== ${last.name} ===\n${last.memo}`);
}
main().finally(() => prisma.$disconnect());

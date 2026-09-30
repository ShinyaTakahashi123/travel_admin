import { prisma } from "../src/lib/prisma";

async function main() {
  const day = await prisma.day.findFirstOrThrow({ where: { itineraryId: "2fd67b8b-59c6-4ea4-ab01-b27e2414a53e", dayNumber: 2 }, include: { spots: true } });
  for (const s of day.spots) console.log(s.name, s.lat, s.lng);
}
main().finally(() => prisma.$disconnect());

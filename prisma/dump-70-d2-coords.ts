import { prisma } from "../src/lib/prisma";

async function main() {
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: "47214a80-9c61-4b42-bc92-b382de9581eb", dayNumber: 2 }, include: { spots: { orderBy: { visitTime: "asc" } } } });
  console.log("dayId=", day2.id);
  for (const s of day2.spots) console.log(s.name, s.id, s.lat, s.lng);
}
main().finally(() => prisma.$disconnect());

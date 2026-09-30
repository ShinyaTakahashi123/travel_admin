import { prisma } from "../src/lib/prisma";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6dc83721%'`);
  const itinId = rows[0].id;
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });
  const s = await prisma.spot.findFirstOrThrow({ where: { name: "別所沼公園", dayId: day2.id } });
  console.log(s.id, "\n", s.memo);
}
main().finally(() => prisma.$disconnect());

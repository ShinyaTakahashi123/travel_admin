import { prisma } from "../src/lib/prisma";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: "0928e88e-380c-4702-9559-af6252822245" } });
  console.log("nights=", (itin as any).nights, "days field candidates:", Object.keys(itin).filter(k => /night|day/i.test(k)));
  const days = await prisma.day.findMany({ where: { itineraryId: itin.id } });
  console.log("day count=", days.length);
}
main().finally(() => prisma.$disconnect());

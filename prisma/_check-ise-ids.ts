import { prisma } from "../src/lib/prisma";
async function main() {
  const spots = await prisma.spot.findMany({
    where: { day: { itineraryId: "c9b3ad40-531b-4085-a2ab-ebb0dd91cdc0" } },
    orderBy: { orderNo: "asc" },
  });
  for (const s of spots) console.log(s.orderNo, s.id, s.name);
}
main().finally(() => prisma.$disconnect());

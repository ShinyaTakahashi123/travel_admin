import { prisma } from "../src/lib/prisma";
async function main() {
  const spots = await prisma.spot.findMany({
    where: { day: { itineraryId: "708a13d8-bdd1-4525-9e63-88b12c57eedc" } },
    orderBy: { orderNo: "asc" },
    include: { transitLegs: true },
  });
  for (const s of spots) console.log(s.orderNo, s.id, s.name, JSON.stringify(s.transitLegs.map(t=>({id:t.id,min:t.transitDurationMin}))));
}
main().finally(() => prisma.$disconnect());

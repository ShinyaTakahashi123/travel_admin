import { prisma } from "../src/lib/prisma";
async function main() {
  const spots = await prisma.spot.findMany({
    where: { day: { itineraryId: "21f198de-13f3-4521-bf40-6e6115c1e4d7" } },
    orderBy: { orderNo: "asc" },
  });
  for (const s of spots) console.log(s.orderNo, s.id, s.name);
}
main().finally(() => prisma.$disconnect());

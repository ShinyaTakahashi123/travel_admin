import { prisma } from "../src/lib/prisma";
async function main() {
  const spots = await prisma.spot.findMany({
    where: { day: { itineraryId: "3bc5f590-86df-44d2-8d07-4eeb8ab4b982" } },
    orderBy: { orderNo: "asc" },
    include: { transitLegs: true },
  });
  for (const s of spots) console.log(s.orderNo, s.id, s.name, JSON.stringify(s.transitLegs.map(t=>({id:t.id,min:t.transitDurationMin}))));
}
main().finally(() => prisma.$disconnect());

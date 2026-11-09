import { prisma } from "../src/lib/prisma";
async function main() {
  const spots = await prisma.spot.findMany({
    where: { day: { itinerary: { id: "5ce1979f-5a9d-4e9b-9f6f-8a24a0dc637d" } } },
    orderBy: { orderNo: "asc" },
    include: { transitLegs: true },
  });
  for (const s of spots) console.log(s.orderNo, s.id, s.name, JSON.stringify(s.transitLegs.map(t=>({id:t.id, min:t.transitDurationMin}))));
}
main().finally(() => prisma.$disconnect());

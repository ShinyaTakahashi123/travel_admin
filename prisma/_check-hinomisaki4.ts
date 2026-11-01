import { prisma } from "../src/lib/prisma";

async function main() {
  console.log('=== 名前に「遊歩道」を含む全スポット（全国） ===');
  const spots = await prisma.spot.findMany({
    where: { name: { contains: "遊歩道" } },
    include: { day: { include: { itinerary: true } } },
    orderBy: { name: "asc" },
  });
  for (const s of spots) {
    console.log(`spot=${s.id} name=${s.name} lat=${s.lat} lng=${s.lng}`);
    console.log(`  itinerary=${s.day.itinerary.id} title=${s.day.itinerary.title}`);
  }
}
main().finally(() => prisma.$disconnect());

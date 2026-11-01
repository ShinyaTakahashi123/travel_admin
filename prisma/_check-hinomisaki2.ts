import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("=== 日御碕周辺(35.42-35.45, 132.60-132.65)の「遊歩道」を含む名前のスポット ===");
  const spots = await prisma.spot.findMany({
    where: {
      name: { contains: "遊歩道" },
      lat: { gte: 35.40, lte: 35.45 },
      lng: { gte: 132.60, lte: 132.65 },
    },
    include: { day: { include: { itinerary: true } } },
  });
  for (const s of spots) {
    console.log(`spot=${s.id} name=${s.name} lat=${s.lat} lng=${s.lng} orderNo=${s.orderNo}`);
    console.log(`  itinerary=${s.day.itinerary.id} title=${s.day.itinerary.title}`);
  }

  console.log("\n=== 念のため「日御碕」を含む名前の全スポット ===");
  const spots2 = await prisma.spot.findMany({
    where: { name: { contains: "日御碕" } },
    include: { day: { include: { itinerary: true } } },
    orderBy: { name: "asc" },
  });
  for (const s of spots2) {
    console.log(`spot=${s.id} name=${s.name} lat=${s.lat} lng=${s.lng} orderNo=${s.orderNo}`);
    console.log(`  itinerary=${s.day.itinerary.id} title=${s.day.itinerary.title}`);
  }
}
main().finally(() => prisma.$disconnect());

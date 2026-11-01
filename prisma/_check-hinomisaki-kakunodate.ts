import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("=== 日御碕 遊歩道の点 (35.432264,132.62518 付近) ===");
  const spots1 = await prisma.spot.findMany({
    where: { lat: { gte: 35.4322, lte: 35.4323 }, lng: { gte: 132.6251, lte: 132.6253 } },
    include: { day: { include: { itinerary: true } } },
  });
  for (const s of spots1) {
    console.log(`spot=${s.id} name=${s.name} lat=${s.lat} lng=${s.lng} orderNo=${s.orderNo} dayId=${s.dayId}`);
    console.log(`  itinerary=${s.day.itinerary.id} title=${s.day.itinerary.title}`);
  }

  console.log("\n=== 桧木内川堤 関連スポット ===");
  const spots2 = await prisma.spot.findMany({
    where: { name: { contains: "桧木内川堤" } },
    include: { day: { include: { itinerary: true } } },
  });
  for (const s of spots2) {
    console.log(`spot=${s.id} name=${s.name} lat=${s.lat} lng=${s.lng} orderNo=${s.orderNo} dayId=${s.dayId}`);
    console.log(`  itinerary=${s.day.itinerary.id} title=${s.day.itinerary.title}`);
  }

  console.log("\n=== ポケットパーク 関連スポット ===");
  const spots3 = await prisma.spot.findMany({
    where: { name: { contains: "ポケットパーク" } },
    include: { day: { include: { itinerary: true } } },
  });
  for (const s of spots3) {
    console.log(`spot=${s.id} name=${s.name} lat=${s.lat} lng=${s.lng} orderNo=${s.orderNo} dayId=${s.dayId}`);
    console.log(`  itinerary=${s.day.itinerary.id} title=${s.day.itinerary.title}`);
  }
}
main().finally(() => prisma.$disconnect());

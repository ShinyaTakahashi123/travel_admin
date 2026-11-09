import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("=== オノカメ点(35.432264,132.62518)から150m以内の全スポット ===");
  const spots = await prisma.spot.findMany({
    where: { lat: { gte: 35.4313, lte: 35.4333 }, lng: { gte: 132.6238, lte: 132.6266 } },
    include: { day: { include: { itinerary: true } } },
  });
  for (const s of spots) {
    console.log(`spot=${s.id} name=${s.name} lat=${s.lat} lng=${s.lng}`);
    console.log(`  itinerary=${s.day.itinerary.id} title=${s.day.itinerary.title}`);
  }
}
main().finally(() => prisma.$disconnect());

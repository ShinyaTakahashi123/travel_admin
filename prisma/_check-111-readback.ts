import { prisma } from "../src/lib/prisma";

async function main() {
  const spot = await prisma.spot.findUniqueOrThrow({ where: { id: "f542a416-37a8-45b8-b1a7-35c2ba4eb89f" } });
  console.log(`name=${spot.name}`);
  console.log(`lat=${spot.lat} lng=${spot.lng}`);
  console.log(`stayDurationMin=${spot.stayDurationMin}`);
  console.log(`memo=${spot.memo}`);
}
main().finally(() => prisma.$disconnect());

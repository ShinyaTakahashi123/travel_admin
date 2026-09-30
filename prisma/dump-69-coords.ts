import { prisma } from "../src/lib/prisma";

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: "a185d199-6248-49a7-80db-7348ee275fda" } });
  console.log(s.name, s.lat, s.lng);
}
main().finally(() => prisma.$disconnect());

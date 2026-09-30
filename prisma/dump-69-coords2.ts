import { prisma } from "../src/lib/prisma";

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: "90be5114-8adf-4f3a-9028-3372a2f6b5f8" } });
  console.log(s.name, s.lat, s.lng);
}
main().finally(() => prisma.$disconnect());

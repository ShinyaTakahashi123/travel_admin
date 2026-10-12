import { prisma } from "../src/lib/prisma";

async function main() {
  const s = await prisma.spot.findUnique({ where: { id: "9f057b8f-e033-4f46-ac41-15a830364c4d" } });
  console.log("dayId=", s?.dayId);
}
main().finally(() => prisma.$disconnect());

import { prisma } from "../src/lib/prisma";
async function main() {
  const spot = await prisma.spot.findUniqueOrThrow({
    where: { id: "4d6a631f-7cbc-44a0-86e0-b61d3c56d9cb" },
    include: { transitLegs: true },
  });
  console.log(JSON.stringify(spot.transitLegs));
}
main().finally(() => prisma.$disconnect());

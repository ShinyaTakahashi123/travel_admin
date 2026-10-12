import { prisma } from "../src/lib/prisma";

async function main() {
  const s = await prisma.spot.findFirst({ where: { name: "美人林", day: { itineraryId: "1d0aa24f-a0e8-4319-b97b-86952764c785" } } });
  console.log(s?.id);
}
main().finally(() => prisma.$disconnect());

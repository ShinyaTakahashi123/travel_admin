import { prisma } from "../src/lib/prisma";

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: "64f70a82-d141-4ea0-86d2-df68a065137a" } });
  console.log(s.name, "mode=", s.transitMode, "tdur=", s.transitDurationMin);
}
main().finally(() => prisma.$disconnect());

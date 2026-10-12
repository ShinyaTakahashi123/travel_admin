import { prisma } from "../src/lib/prisma";

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: "82719e0e-ec86-4c02-8672-b6a4735775f7" } });
  console.log(s.name, "mode=", s.transitMode, "tdur=", s.transitDurationMin);
}
main().finally(() => prisma.$disconnect());

import { prisma } from "../src/lib/prisma";

async function main() {
  const ids = [
    "fb050c23-3dfd-45c9-bc1f-4ab1097ee065", // 大堂海岸
  ];
  for (const id of ids) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id } });
    console.log(s.name, s.lat, s.lng);
  }
}
main().finally(() => prisma.$disconnect());

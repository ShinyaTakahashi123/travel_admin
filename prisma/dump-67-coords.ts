import { prisma } from "../src/lib/prisma";

async function main() {
  const ids = [
    "45116e76-b3ba-45c3-9a27-2e53fc38b804", // 大阪市中央公会堂
    "1607f556-d309-4298-a106-6fdf1edfad5a", // 大阪城天守閣
  ];
  for (const id of ids) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id } });
    console.log(s.name, s.lat, s.lng);
  }
}
main().finally(() => prisma.$disconnect());

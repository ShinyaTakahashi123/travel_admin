import { prisma } from "../src/lib/prisma";

const ITIN = "24469e72-101c-4fcc-99e3-2d736d0c8ffb";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN } });
  console.log(`=== [description] ===\n${itin.description}\n`);
  const ids = [
    "6ec0a75d-47b4-4f91-9895-a4eef7d5dd56", // アクアマリンふくしま
    "e973ad09-8f4a-4362-b67d-3b6e0db33ff1", // 塩屋埼灯台
    "be960590-5ae5-42d9-b698-f69f85f4fcd8", // さはこの湯
  ];
  for (const id of ids) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id } });
    console.log(`=== ${s.name} ===\n${s.memo}\n`);
  }
}
main();

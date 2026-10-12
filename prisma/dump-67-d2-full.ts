import { prisma } from "../src/lib/prisma";

const ids = [
  "990a3437-08dd-41a2-8db8-b9cfbd57713e", // 国立国際美術館
  "1e3226ab-406a-4d30-95a2-c00617f44676", // 扇町公園
  "e4da007f-9d8d-4c1c-9f99-e18b86ff441b", // 大阪天満宮
  "94364d94-f7db-4f6c-a987-6da2a2680980", // 天神橋筋商店街
];

async function main() {
  for (const id of ids) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id } });
    console.log(`=== ${s.name} ===\n${s.memo}\n`);
  }
}
main();

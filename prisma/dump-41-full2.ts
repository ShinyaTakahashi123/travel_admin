import { prisma } from "../src/lib/prisma";

const ids = [
  "75a5f18c-878a-47b9-8796-f5237b66a880", // 福州園
  "80ac9bf7-c0d0-476f-ab80-055bbc795110", // 国際通り
  "6d596df2-544d-45d5-a85a-ce252f6cc4f3", // 首里城公園
];

async function main() {
  for (const id of ids) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id } });
    console.log(`=== ${s.name} ===\n${s.memo}\n`);
  }
}
main();

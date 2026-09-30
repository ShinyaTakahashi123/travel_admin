import { prisma } from "../src/lib/prisma";

const ids = [
  "ce116b8a-7ad0-499d-b83b-a8ba4d1bbe8f", // 法輪寺（嵯峨）
  "e9b1cf7c-698d-4117-b44d-0fcc39f6b3c4", // 天龍寺
  "27ae374c-b6d9-4a11-aa95-bb094ec8e6ba", // 常寂光寺
  "7a9b51dc-7451-452c-9771-ee52351f8117", // 嵯峨鳥居本の町並み
  "bea2f72c-348a-4993-a074-5496f436f1b4", // 滝口寺
];

async function main() {
  for (const id of ids) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id } });
    console.log(`=== ${s.name} ===\n${s.memo}\n`);
  }
}
main();

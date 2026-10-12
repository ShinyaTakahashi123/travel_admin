import { prisma } from "../src/lib/prisma";

const ids = [
  "8f2a43b8-b478-4f3f-a702-5f86fbf3397c", // 東大寺
  "ab0e4bb3-275b-4702-8d31-8ca0fdd756fd", // 奈良公園
  "9e0ff62b-6abc-44a3-970d-10d0bbb903a9", // 春日大社
];

async function main() {
  for (const id of ids) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id } });
    console.log(`=== ${s.name} ===\n${s.memo}\n`);
  }
}
main();

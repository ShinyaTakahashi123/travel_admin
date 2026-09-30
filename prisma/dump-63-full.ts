import { prisma } from "../src/lib/prisma";

const ids = [
  "e58e76b9-760f-4b3b-97fa-39cba0bfbd1e", // 善徳寺
  "d1dea107-0a17-4984-8609-60591c31341a", // 曳山会館
  "5180d5bb-2cc0-494f-8c01-3ff1c8bd4a59", // 相倉合掌造り集落
  "ffb07e91-25b0-46e2-b71c-0b5e7a831a6d", // ゆ～楽
];

async function main() {
  for (const id of ids) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id } });
    console.log(`=== ${s.name} ===\n${s.memo}\n`);
  }
}
main();

import { prisma } from "../src/lib/prisma";

const ids = [
  "ffda7890-a7bf-41de-9d61-c81c6d31c22c", // 奥武山公園
  "e4088ac5-5f9d-496e-9852-e6c0cbc50d8f", // 対馬丸記念館
  "36e4272c-e48a-42a2-8001-67552a3410e2", // 波の上ビーチ
];

async function main() {
  for (const id of ids) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id } });
    console.log(`=== ${s.name} (mode=${s.transitMode} dur=${s.transitDurationMin}) ===\n${s.memo}\n`);
  }
}
main();

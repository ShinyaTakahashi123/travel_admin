import { prisma } from "../src/lib/prisma";

const ids = [
  "e3b3c4e0-5742-413a-89b6-55081bcbaa91", // 門司港駅
  "9520fdbd-7e2f-4375-b5de-f2f86e8461d1", // 海峡プラザ
  "75dc2bf8-e439-4425-b221-803a703a7cf1", // 出光美術館（門司）
];

async function main() {
  for (const id of ids) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id } });
    console.log(`=== ${s.name} (mode=${s.transitMode} dur=${s.transitDurationMin}) ===\n${s.memo}\n`);
  }
}
main();

import { prisma } from "../src/lib/prisma";

const targets: [string, string][] = [
  ["708a13d8-bdd1-4525-9e63-88b12c57eedc", "成田山"],
  ["3bc5f590-86df-44d2-8d07-4eeb8ab4b982", "太宰府"],
  ["c9b3ad40-531b-4085-a2ab-ebb0dd91cdc0", "伊勢"],
  ["21f198de-13f3-4521-bf40-6e6115c1e4d7", "出雲"],
];

async function main() {
  for (const [id, label] of targets) {
    const spots = await prisma.spot.findMany({
      where: { day: { itineraryId: id } },
      orderBy: { orderNo: "asc" },
      include: { transitLegs: true },
    });
    console.log(`\n### ${label}`);
    for (const s of spots) {
      console.log(`[${s.orderNo}] ${s.name} legs=${JSON.stringify(s.transitLegs.map((t) => ({ mode: t.transitMode, min: t.transitDurationMin })))}`);
      console.log(`  末尾: ...${s.memo?.slice(-80)}`);
    }
  }
}
main().finally(() => prisma.$disconnect());

import { prisma } from "../src/lib/prisma";

const ITIN = "2fd67b8b-59c6-4ea4-ab01-b27e2414a53e";

function hm(d: Date) {
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

async function main() {
  const days = await prisma.day.findMany({ where: { itineraryId: ITIN }, include: { spots: true } });
  for (const d of days) {
    console.log(`Day${d.dayNumber} (id=${d.id}):`);
    for (const s of d.spots) {
      console.log(`  orderNo=${s.orderNo} ${s.name} visit=${hm(s.visitTime!)} stay=${s.stayDurationMin}`);
    }
  }
}
main().finally(() => prisma.$disconnect());

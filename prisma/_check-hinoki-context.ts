import { prisma } from "../src/lib/prisma";

const IDS = [
  "c10810bd-7737-4403-a98b-d1e852c8d138",
  "afb492ce-ab6d-4aeb-9879-5cea0ad0624b",
];

async function main() {
  for (const id of IDS) {
    const it = await prisma.itinerary.findUnique({ where: { id } });
    console.log(`\n### ${id} ${it?.title}`);
    const spots = await prisma.spot.findMany({
      where: { day: { itineraryId: id } },
      orderBy: { orderNo: "asc" },
      include: { transitLegs: { orderBy: { orderNo: "asc" } } },
    });
    for (const s of spots) {
      console.log(`  [${s.orderNo}] ${s.name} lat=${s.lat} lng=${s.lng} stay=${s.stayDurationMin}`);
      console.log(`    memo=${s.memo}`);
      console.log(`    legs=${JSON.stringify(s.transitLegs.map((t) => ({ mode: t.transitMode, min: t.transitDurationMin })))}`);
    }
  }
}
main().finally(() => prisma.$disconnect());

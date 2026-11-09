import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "77b83773-6635-47f0-a22b-ec99cf45b91e";

function hm(d: Date) {
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

async function main() {
  const days = await prisma.day.findMany({
    where: { itineraryId: ITINERARY_ID },
    orderBy: { dayNumber: "asc" },
    include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } },
  });
  for (const d of days) {
    console.log(`\n=== Day ${d.dayNumber} ===`);
    for (const s of d.spots) {
      console.log(
        `\n[orderNo=${s.orderNo}] ${s.name}\n  visitTime=${s.visitTime ? hm(s.visitTime) : null} stayDurationMin=${s.stayDurationMin}\n  lat=${s.lat} lng=${s.lng}\n  transitLegs=${JSON.stringify(s.transitLegs.map((t) => ({ mode: t.transitMode, min: t.transitDurationMin })))}\n  memo=${s.memo}`
      );
    }
  }
}
main().finally(() => prisma.$disconnect());

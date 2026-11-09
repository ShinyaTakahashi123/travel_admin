import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "ea38491a-1d85-432a-b2ed-6687d493e6ef";

function hm(d: Date) {
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

async function main() {
  const itinerary = await prisma.itinerary.findFirstOrThrow({ where: { id: ITINERARY_ID } });
  console.log("=== Itinerary ===");
  console.log("title:", itinerary.title);
  console.log("description:", itinerary.description);
  console.log("status:", itinerary.status);
  console.log("seasons:", itinerary.seasons);

  const days = await prisma.day.findMany({
    where: { itineraryId: ITINERARY_ID },
    orderBy: { dayNumber: "asc" },
    include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } },
  });

  for (const d of days) {
    console.log(`\n=== Day ${d.dayNumber} (dayId=${d.id}) ===`);
    for (const s of d.spots) {
      console.log(
        `\n[orderNo=${s.orderNo}] ${s.name} (id=${s.id})\n  visitTime=${s.visitTime ? hm(s.visitTime) : null} stayDurationMin=${s.stayDurationMin}\n  lat=${s.lat} lng=${s.lng}\n  transitLegs=${JSON.stringify(s.transitLegs.map((t) => ({ mode: t.transitMode, min: t.transitDurationMin, line: t.transitLine })))}\n  memo=${s.memo}`
      );
    }
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

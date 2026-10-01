import { prisma } from "../src/lib/prisma";

const ITIN = "071e87fd-03f9-4cdd-a3b5-170c62e6a807";

function hm(d: Date) {
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

async function main() {
  const days = await prisma.day.findMany({
    where: { itineraryId: ITIN },
    orderBy: { dayNumber: "asc" },
    include: { spots: { orderBy: { visitTime: "asc" } } },
  });
  for (const d of days) {
    console.log(`\n-- Day${d.dayNumber} --`);
    for (const s of d.spots) {
      console.log(`${s.name} visit=${hm(s.visitTime!)} stay=${s.stayDurationMin}`);
    }
  }
}
main();

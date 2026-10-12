import { prisma } from "../src/lib/prisma";

const ITIN = "41e37fe5-383f-47ff-9375-dda356f10a9a";

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
      console.log(`${s.name} id=${s.id} visit=${hm(s.visitTime!)} stay=${s.stayDurationMin} mode=${s.transitMode} tdur=${s.transitDurationMin}`);
    }
  }
}
main();

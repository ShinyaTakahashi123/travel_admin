import { prisma } from "../src/lib/prisma";

const ITIN = "1621a020-b8f3-41ff-bb67-270b99f0782d";

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
    console.log(`\n-- Day${d.dayNumber} (id=${d.id}) --`);
    for (const s of d.spots) {
      console.log(
        `${s.name} id=${s.id} visit=${hm(s.visitTime!)} stay=${s.stayDurationMin} mode=${s.transitMode} tdur=${s.transitDurationMin} line=${s.transitLine}`
      );
    }
  }
}
main();

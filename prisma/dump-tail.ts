import { prisma } from "../src/lib/prisma";

const PREFIX = process.argv[2];

async function main() {
  const itins: any[] = await prisma.$queryRawUnsafe(
    `SELECT id, title FROM itinerary WHERE id::text LIKE '${PREFIX}%'`
  );
  if (itins.length !== 1) throw new Error(`0件または複数件: ${itins.length}`);
  const itinId = itins[0].id;
  console.log(`### ${itins[0].title} (${itinId}) ###`);
  const days = await prisma.day.findMany({
    where: { itineraryId: itinId },
    orderBy: { dayNumber: "asc" },
    include: { spots: { orderBy: { visitTime: "asc" } } },
  });
  for (const d of days) {
    console.log(`\n-- Day${d.dayNumber} (${d.spots.length}か所) --`);
    d.spots.forEach((s, i) => {
      const tail = s.memo ? s.memo.slice(-120) : "";
      console.log(`[${i + 1}] ${s.name} (id=${s.id})\n  末尾: ...${tail}`);
    });
  }
}
main();

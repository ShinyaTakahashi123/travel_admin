import { prisma } from "../src/lib/prisma";

async function main() {
  for (const id of ["0582b3c4-fa96-40c2-ad37-c998f8b087a4", "96496141-6378-4073-8262-12a2523ad26e"]) {
    console.log(`\n=== ${id} ===`);
    const spots = await prisma.spot.findMany({
      where: { day: { itineraryId: id } },
      orderBy: [{ day: { dayNumber: "asc" } }, { orderNo: "asc" }],
    });
    for (const s of spots) console.log(s.name, s.lat, s.lng, s.id);
  }
}
main().finally(() => prisma.$disconnect());

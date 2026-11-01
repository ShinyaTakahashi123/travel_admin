import { prisma } from "../src/lib/prisma";

const IDS = [
  "21f198de-13f3-4521-bf40-6e6115c1e4d7",
  "d686aaf2-9cd1-4c2a-a27f-87e042f9d717",
  "bb5348fc-c7db-472c-82fc-5ddb3db3253b",
  "7da7343c-0d38-4c30-8818-42ba7d184d2b",
];

async function main() {
  for (const id of IDS) {
    const it = await prisma.itinerary.findUnique({ where: { id } });
    console.log(`\n### ${id} ${it?.title}`);
    const spots = await prisma.spot.findMany({
      where: { day: { itineraryId: id } },
      orderBy: { orderNo: "asc" },
    });
    for (const s of spots) {
      console.log(`  [${s.orderNo}] ${s.name} lat=${s.lat} lng=${s.lng}`);
    }
  }
}
main().finally(() => prisma.$disconnect());

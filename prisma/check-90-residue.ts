import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "dba1a628-faa4-451e-94d2-73f6a09356e4";

async function main() {
  const itinerary = await prisma.itinerary.findFirstOrThrow({ where: { id: ITINERARY_ID } });
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID } } });

  const needles = ["浄智寺", "妙本寺"];
  for (const needle of needles) {
    if (itinerary.description?.includes(needle)) console.log(`[残り] 説明文に「${needle}」`);
    for (const s of spots) {
      if (s.memo?.includes(needle)) console.log(`[残り] ${s.name} のメモに「${needle}」`);
    }
  }
  console.log("説明文:", itinerary.description);
  console.log("title:", itinerary.title);
  console.log("円覚寺の現在のstayDurationMin(書き込み前):");
  const engakuji = spots.find((s) => s.id === "e541dae7-99f7-491f-8718-7d659acf1bba");
  console.log(engakuji?.stayDurationMin);
  console.log("検索完了");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

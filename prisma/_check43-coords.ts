import { prisma } from "../src/lib/prisma";

async function main() {
  const candidates = await prisma.itinerary.findMany({ where: { title: { contains: "彦根" } }, select: { id: true, title: true } });
  console.log("candidates:", candidates);
  const itinerary = candidates.find((c) => c.id.startsWith("77b83773"));
  if (!itinerary) {
    console.log("not found");
    return;
  }
  console.log("id:", itinerary!.id, "title:", itinerary!.title);
  if (!itinerary) return;
  const spots = await prisma.spot.findMany({
    where: { day: { itineraryId: itinerary.id } },
    orderBy: [{ day: { dayNumber: "asc" } }, { orderNo: "asc" }],
  });
  for (const s of spots) console.log(s.name, s.lat, s.lng, s.id);
}
main().finally(() => prisma.$disconnect());

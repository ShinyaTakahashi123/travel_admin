import { prisma } from "../src/lib/prisma";

async function main() {
  const candidates = await prisma.itinerary.findMany({ select: { id: true, title: true, description: true, status: true } });
  const it = candidates.find((c) => c.id.startsWith("d4fc7a52"));
  if (!it) { console.log("見つかりません"); return; }
  console.log(`id=${it.id} status=${it.status}`);
  console.log(`title=${it.title}`);
  console.log(`description=${it.description}`);
  const spots = await prisma.spot.findMany({
    where: { day: { itineraryId: it.id } },
    orderBy: { orderNo: "asc" },
    include: { transitLegs: true },
  });
  for (const s of spots) {
    console.log(`\n[${s.orderNo}] ${s.name} legs=${JSON.stringify(s.transitLegs.map((t) => ({ mode: t.transitMode, min: t.transitDurationMin })))}`);
    console.log(`  末尾: ...${s.memo?.slice(-100)}`);
  }
}
main().finally(() => prisma.$disconnect());

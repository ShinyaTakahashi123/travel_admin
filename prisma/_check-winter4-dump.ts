import { prisma } from "../src/lib/prisma";

const IDS: Record<string, string> = {
  "成田山": "708a13d8",
  "伊勢": "c9b3ad40",
  "太宰府": "3bc5f590",
  "出雲": "21f198de",
};

function hm(d: Date | null) {
  if (!d) return "null";
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

async function main() {
  for (const [label, prefix] of Object.entries(IDS)) {
    const candidates = await prisma.itinerary.findMany({ select: { id: true, title: true, description: true, status: true } });
    const it = candidates.find((c) => c.id.startsWith(prefix));
    if (!it) { console.log(`\n### ${label}(${prefix}) 見つかりません`); continue; }
    console.log(`\n### ${label} ${it.id} status=${it.status}`);
    console.log(`title=${it.title}`);
    console.log(`description=${it.description}`);
    const days = await prisma.day.findMany({
      where: { itineraryId: it.id },
      orderBy: { dayNumber: "asc" },
      include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } },
    });
    for (const d of days) {
      console.log(`\n-- Day${d.dayNumber} --`);
      for (const s of d.spots) {
        console.log(`[${s.orderNo}] ${s.name} ${hm(s.visitTime)} stay=${s.stayDurationMin} lat=${s.lat} lng=${s.lng}`);
        console.log(`  legs=${JSON.stringify(s.transitLegs.map((t) => ({ mode: t.transitMode, min: t.transitDurationMin, line: t.transitLine })))}`);
        console.log(`  memo=${s.memo}`);
      }
    }
  }
}
main().finally(() => prisma.$disconnect());

import { prisma } from "../src/lib/prisma";

function hm(d: Date) {
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

async function main() {
  const it = await prisma.itinerary.findFirstOrThrow({
    where: { title: "大洲城と臥龍山荘、伊予の小京都をめぐる日帰りプラン" },
    include: {
      days: { include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: true, photos: true } } } },
      areas: { include: { area: true } },
      tags: { include: { tag: true } },
      purposeTags: { include: { purposeTag: true } },
    },
  });
  console.log(`id=${it.id} status=${it.status} nights=${it.nights}`);
  console.log(`areas=${it.areas.map((a) => a.area.name).join(",")}`);
  console.log(`tags=${it.tags.map((t) => t.tag.name).join(",")} purpose=${it.purposeTags.map((p) => p.purposeTag.name).join(",")}`);
  for (const s of it.days[0].spots) {
    console.log(`\n[${s.orderNo}] ${s.name} ${hm(s.visitTime!)} stay=${s.stayDurationMin} lat=${s.lat} lng=${s.lng} photos=${s.photos.length}`);
    console.log(`  legs=${JSON.stringify(s.transitLegs.map((t) => ({ mode: t.transitMode, min: t.transitDurationMin })))}`);
  }
}
main().finally(() => prisma.$disconnect());

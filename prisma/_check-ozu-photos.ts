import { prisma } from "../src/lib/prisma";

async function main() {
  const it = await prisma.itinerary.findFirstOrThrow({
    where: { title: "大洲城と臥龍山荘、伊予の小京都をめぐる日帰りプラン" },
    include: { days: { include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } },
  });
  for (const s of it.days[0].spots) {
    for (const p of s.photos) {
      console.log(`\n[${s.name}]`);
      console.log(`  url=${p.url}`);
      console.log(`  sourceUrl=${p.sourceUrl}`);
      console.log(`  author=${p.author}`);
      console.log(`  license=${p.license} licenseUrl=${p.licenseUrl}`);
    }
  }
}
main().finally(() => prisma.$disconnect());

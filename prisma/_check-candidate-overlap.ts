import { prisma } from "../src/lib/prisma";

const KEYWORDS = ["津和野", "大野", "杵築", "村上", "郡上", "米沢", "大洲", "竹田", "日田", "近江八幡", "美濃市", "丹波篠山"];

async function main() {
  for (const kw of KEYWORDS) {
    const rows = await prisma.itinerary.findMany({
      where: { title: { contains: kw } },
      select: { id: true, title: true, status: true },
    });
    console.log(`\n【${kw}】 ${rows.length}件`);
    for (const r of rows) console.log(`  ${r.id} [${r.status}] ${r.title}`);
  }
}
main().finally(() => prisma.$disconnect());

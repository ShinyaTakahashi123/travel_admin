import { prisma } from "../src/lib/prisma";

async function main() {
  const ehime = await prisma.area.findFirst({ where: { name: "愛媛県", level: "prefecture" } });
  const subs = await prisma.area.findMany({ where: { parentId: ehime!.id }, orderBy: { displayOrder: "asc" } });
  for (const s of subs) console.log(s.name, s.displayOrder, s.slug);
}
main().finally(() => prisma.$disconnect());

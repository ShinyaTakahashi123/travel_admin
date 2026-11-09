import { prisma } from "../src/lib/prisma";

async function main() {
  const ehime = await prisma.area.findFirst({ where: { name: "愛媛県", level: "prefecture" } });
  console.log("愛媛県 id:", ehime?.id);
  if (ehime) {
    const subs = await prisma.area.findMany({ where: { parentId: ehime.id } });
    console.log("sub areas:", subs.map((a) => a.name));
  }
  const tags = await prisma.tag.findMany({ select: { name: true } });
  console.log("\ntags:", tags.map((t) => t.name).join(" / "));
  const purposes = await prisma.purposeTag.findMany({ select: { name: true } });
  console.log("\npurposeTags:", purposes.map((t) => t.name).join(" / "));
}
main().finally(() => prisma.$disconnect());

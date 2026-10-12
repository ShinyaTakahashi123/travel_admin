/**
 * #315の続き(自己チェック、descriptionの言い切り)。
 * descriptionにも本文と同じ「日本初の」の言い切りがあったため、本文と
 * 揃えてヘッジした。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-315c-73c2a636.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";

const ITIN_ID = "73c2a636-6381-4cf5-9f24-f7d344692cc1";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const old = "エル・グレコの名画も収蔵する、日本初の西洋美術中心の私立美術館・大原美術館。";
  const next = "エル・グレコの名画も収蔵する、日本初とされる西洋美術中心の私立美術館・大原美術館。";
  if (itin.description?.includes(old)) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: itin.description.replace(old, next) } });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

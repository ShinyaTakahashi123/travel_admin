/**
 * #369の続き。禁止語スキャンで、説明文の「日本三大朝市の一つ、輪島朝市。」に
 * 同一文のヘッジがないと出たため、「とされる」を追加する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-369b-ceb2a9a1.ts
 */
import { prisma } from "../src/lib/prisma";

const ITIN_ID = "ceb2a9a1-b55e-4bb4-90a4-c863a10e3727";

async function main() {
  const itin = await prisma.itinerary.findFirstOrThrow({ where: { id: ITIN_ID } });
  const oldText = "日本三大朝市の一つ、輪島朝市。";
  const newText = "日本三大朝市の一つとされる輪島朝市。";
  if (!itin.description?.includes(oldText)) {
    console.log("already applied, skipping");
    return;
  }
  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: { description: itin.description.replace(oldText, newText) },
  });
  console.log("#369続き: 説明文の「日本三大朝市」にヘッジを追加");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

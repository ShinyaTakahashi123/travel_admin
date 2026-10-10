/**
 * #347の続き。説明文「日本一の高さを誇る黒部ダム」にヘッジがなかったため
 * 追加(本文側は#347で既に「日本一の高さとされています」と修正済み)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-347c-aec8eadc.ts
 */
import { prisma } from "../src/lib/prisma";

const ITIN_ID = "aec8eadc-75da-4179-8c8c-013bb4b3c01f";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });

  const descOld = "日本一の高さを誇る黒部ダムの大観光放水を見る。";
  const descNext = "日本一の高さとされる黒部ダムで、迫力の観光放水を見る。";
  if (!itin.description?.includes(descOld)) {
    if (itin.description?.includes(descNext)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("description anchor not found");
  }

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: itin.description.replace(descOld, descNext) } });
  console.log("description hedge added");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

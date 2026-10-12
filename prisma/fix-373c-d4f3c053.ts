/**
 * #373の続き。fix-373bで移動時間の数字を直したが、本文の「歩いて〇分ほど」
 * の書き出しが古い数字のまま残っていた(直し漏れ)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-373c-d4f3c053.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "e708eacb-a5bc-45c4-8e50-b75d9b2ad14b";
const DAY2_ID = "d2670dc7-26f6-4415-b272-7d108d5f3a8e";

async function main() {
  const jikoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "持光寺" } });
  const tosen = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "尾道渡船" } });

  if (!jikoji.memo?.includes("尾道市立美術館から歩いて15分ほど")) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: jikoji.id },
    data: { memo: jikoji.memo.replace("尾道市立美術館から歩いて15分ほど", "尾道市立美術館から歩いて8分ほど") },
  });

  await prisma.spot.update({
    where: { id: tosen.id },
    data: { memo: tosen.memo?.replace("西郷寺から歩いて8分ほど", "西郷寺から歩いて18分ほど") },
  });

  console.log("#373続き: 持光寺・尾道渡船の書き出しの移動時間の直し漏れを修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #371の続き。法務の指摘。地質標本館の結びに古い名前「サイエンス・
 * スクエアつくば」が残っていたため、「AIST-Cube」に直す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-371d-d20ff955.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "78eb1ce7-82b5-45de-9686-a07f4031f663";

async function main() {
  const chishitsu = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "地質標本館" } });
  const oldText = "見学を終えたら、歩いてサイエンス・スクエアつくばへ向かいましょう。";
  const newText = "見学を終えたら、歩いてAIST-Cubeへ向かいましょう。";
  if (!chishitsu.memo?.includes(oldText)) {
    console.log("already applied, skipping");
    return;
  }
  await prisma.spot.update({
    where: { id: chishitsu.id },
    data: { memo: chishitsu.memo.replace(oldText, newText) },
  });
  console.log("#371続き: 地質標本館の結びの古い名前を直した");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

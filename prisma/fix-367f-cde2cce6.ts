/**
 * #367の続き。法務の参考指摘: 旧齋藤家別邸の「月曜は休館のことが多いので」は
 * 曜日を書いている(決まり9は曜日・日付は書かない方針)。ほかのしおりと同じ
 * 書き方「休館日は公式サイトの案内で確かめましょう」にそろえる。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-367f-cde2cce6.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "93e13569-6bfe-4462-8f6e-3cbff8bb17e5";

async function main() {
  const saitoke = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "旧齋藤家別邸" } });
  const oldText = "月曜は休館のことが多いので、公式サイトで確認してから訪れましょう。";
  const newText = "休館日は公式サイトの案内で確かめましょう。";
  if (!saitoke.memo?.includes(oldText)) {
    console.log("already applied, skipping");
    return;
  }
  await prisma.spot.update({
    where: { id: saitoke.id },
    data: { memo: saitoke.memo.replace(oldText, newText) },
  });
  console.log("#367続き: 旧齋藤家別邸の休館案内の書き方をそろえた");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

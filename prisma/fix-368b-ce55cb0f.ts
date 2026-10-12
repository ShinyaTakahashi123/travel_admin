/**
 * #368の続き。prayer-check.cjsで、三徳山三佛寺の紹介文に配慮の一文
 * (「敬意」「手を合わせ」)が見当たらないと出たため追記する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-368b-ce55cb0f.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "ccb88c35-5eb7-4b59-ad40-9cb05a19cf7e";

async function main() {
  const sanbutsuji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "三徳山三佛寺（投入堂）" } });
  const oldText = "雨や雪など天候の悪い日は、入山できないことがあります。足元に気をつけて、ゆっくりと進みましょう。";
  const newText =
    "雨や雪など天候の悪い日は、入山できないことがあります。古くから行者が守ってきた祈りの道なので、敬意を持って、足元に気をつけながらゆっくりと進みましょう。";
  if (!sanbutsuji.memo?.includes(oldText)) {
    console.log("already applied, skipping");
    return;
  }
  await prisma.spot.update({
    where: { id: sanbutsuji.id },
    data: { memo: sanbutsuji.memo.replace(oldText, newText) },
  });
  console.log("#368続き: 三徳山三佛寺の配慮の一文に「敬意」を追加");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

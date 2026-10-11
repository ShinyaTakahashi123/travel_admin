/**
 * #372の続き。企画運営の指摘。レッサーパンダ「風太」(23歳、高齢)について
 * 「今も元気に暮らしている」は、時間がたつと事実と違ってしまうおそれが
 * あるため、時がたっても変わらない言い方(話題になった、という過去の事実
 * のみ)に修正する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-372e-d4523cde.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "305fcdd7-999d-4c5b-9e64-79445ec2bf41";

async function main() {
  const zoo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "千葉市動物公園" } });
  const oldText =
    "昭和60年(1985)に開園した動物園で、後ろ足だけで立つ姿が人気を集めた、レッサーパンダの「風太」が今も元気に暮らしていることでも知られています。";
  const newText =
    "昭和60年(1985)に開園した動物園で、後ろ足だけで立つ姿が話題になったレッサーパンダ「風太」でも知られています。";
  if (!zoo.memo?.includes(oldText)) {
    console.log("already applied, skipping");
    return;
  }
  await prisma.spot.update({
    where: { id: zoo.id },
    data: { memo: zoo.memo.replace(oldText, newText) },
  });
  console.log("#372続き: 風太の文を時がたっても変わらない言い方に修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

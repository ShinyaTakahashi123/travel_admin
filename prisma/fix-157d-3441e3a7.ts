/**
 * #157の続き。企画運営の指摘に対応。
 * 車を二色浜駅近くで借り、りんくうタウン駅前で返す(借りた店と別の場所)
 * ため、スカイビューの結びに、前もって確かめるよう案内する一文を追加
 * (#136と同じ書き方)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-157d-3441e3a7.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "f31b13cc-c09e-41cc-8ad9-67ac4bc563d0";

async function main() {
  const skyview = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "関空展望ホール スカイビュー" } });

  if (!skyview.memo?.includes("見学を終えたら、車でおよそ15分のりんくうタウン駅前へ戻り、レンタカーを返却してから帰りましょう。")) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: skyview.id },
    data: {
      memo: skyview.memo.replace(
        "見学を終えたら、車でおよそ15分のりんくうタウン駅前へ戻り、レンタカーを返却してから帰りましょう。",
        "見学を終えたら、車でおよそ15分のりんくうタウン駅前へ戻り、レンタカーを返却してから帰りましょう(借りた店と別の場所で返せるか、前もって確かめましょう)。"
      ),
    },
  });

  console.log("#157続き: スカイビューの結びに、乗り捨て可否を前もって確かめる一文を追加");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

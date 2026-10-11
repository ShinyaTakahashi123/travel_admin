/**
 * #370の続き。fix-370cで道の駅いぶすきの店名を外したが、書き出しの
 * 「彩花菜館で食事をとりましょう」が直し漏れだったため修正する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-370d-d0407258.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "a602dd91-f920-439a-8ccb-2e187f19a5a2";

async function main() {
  const douno = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "道の駅いぶすきで昼食" } });
  const oldText = "お昼は道の駅いぶすきの彩花菜館で食事をとりましょう。";
  const newText = "お昼は道の駅いぶすきで食事をとりましょう。";
  if (!douno.memo?.includes(oldText)) {
    console.log("already applied, skipping");
    return;
  }
  await prisma.spot.update({
    where: { id: douno.id },
    data: { memo: douno.memo.replace(oldText, newText) },
  });
  console.log("#370続き: 道の駅いぶすきの書き出しの店名を外した(直し漏れ)");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

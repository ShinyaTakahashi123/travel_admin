/**
 * #78の訂正。初日(Day1)最後のすすきののメモに宿の一文がなかった
 * (法務の指摘、itinerary-rules 73行目)。2日目には「今夜も札幌に
 * 泊まります。」があるため、初日にも足す。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-78-ab18b6d8-correction.ts
 *   反映: npm run prod -- npx tsx prisma/fix-78-ab18b6d8-correction.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const SUSUKINO_ID = "8a519a5e-48c6-4287-b3d6-244b3af4894c";

const FIND = "夜は人通りが多くなるので、まわりに気をつけて歩きましょう。";
const REPLACE = "夜は人通りが多くなるので、まわりに気をつけて歩きましょう。この夜は、札幌の宿に泊まりましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const spot = await prisma.spot.findFirstOrThrow({ where: { id: SUSUKINO_ID } });
  if (!spot.memo?.includes(FIND)) {
    console.log(`[想定と違います] すすきのに「${FIND}」が見つかりません。処理を中止します。`);
    return;
  }
  const newMemo = spot.memo!.replace(FIND, REPLACE);

  console.log("=== #78 訂正: すすきのに宿の一文を追加 ===");
  console.log(newMemo);

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({ where: { id: SUSUKINO_ID }, data: { memo: newMemo } });
  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

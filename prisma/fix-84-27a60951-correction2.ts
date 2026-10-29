/**
 * #84の訂正その2。法務の指摘2点。
 * 1. 甘樫丘(2日目最後)のメモに帰りの一文がなかったため追加(歩いておよそ39分の近鉄飛鳥駅へ)
 * 2. 高松塚古墳の点(34.462222,135.806472、度分秒をそのまま10進にした形でOSMの地物から
 *    約30mずれ)を、メモが見学の中心として説明している高松塚壁画館の点(OSM node1423093823、
 *    34.4624561,135.8055508)に直す。前後の歩き(亀石から20分・石舞台まで38分)は、実測が
 *    それぞれ18.9分・42.1分で、どちらも5分以内の差のため変更なし。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-84-27a60951-correction2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-84-27a60951-correction2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const AMAKASHI_ID = "8e014793-7819-430e-9947-d8ac04585f0e";
const TAKAMATSUZUKA_ID = "6ce02298-fe93-4ff2-b1c2-45b9cf79b950";

const AMAKASHI_FIND = "2日間で巡った飛鳥の歴史と自然を、この丘からの眺めで締めくくります。";
const AMAKASHI_REPLACE =
  "2日間で巡った飛鳥の歴史と自然を、この丘からの眺めで締めくくります。見学を終えたら、歩いておよそ39分の近鉄飛鳥駅へ向かい、帰りましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const amakashi = await prisma.spot.findFirstOrThrow({ where: { id: AMAKASHI_ID } });
  if (!amakashi.memo?.includes(AMAKASHI_FIND)) {
    console.log("[想定と違います] 甘樫丘のメモに想定の文が見つかりません。処理を中止します。");
    return;
  }
  const newAmakashiMemo = amakashi.memo.replace(AMAKASHI_FIND, AMAKASHI_REPLACE);

  console.log("=== #84 訂正その2 ===");
  console.log("甘樫丘のメモに帰りの一文を追加:");
  console.log(newAmakashiMemo);
  console.log("\n高松塚古墳の座標: 34.462222,135.806472 → 34.462456,135.805551(高松塚壁画館)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction([
    prisma.spot.update({ where: { id: AMAKASHI_ID }, data: { memo: newAmakashiMemo } }),
    prisma.spot.update({ where: { id: TAKAMATSUZUKA_ID }, data: { lat: 34.462456, lng: 135.805551 } }),
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

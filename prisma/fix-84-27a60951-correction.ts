/**
 * #84の緊急訂正。企画運営の指摘(77分のすき間)をきっかけに、初日のfix-84-27a60951.ts
 * 本体で、亀石・高松塚古墳・石舞台古墳・橘寺の4か所のvisitTimeを、前のスポットの出発時刻
 * (到着+滞在)に移動のleg分を正しく足さずに計算していた(途中の滞在を1つ分見落とす形の
 * 計算違い)ことが判明。正しい鎖で計算し直すと、以下のようにずれていた:
 *   亀石: 11:29(誤)→11:34(正)
 *   高松塚古墳: 12:14(誤)→12:34(正)
 *   石舞台古墳: 13:34(誤)→14:12(正)
 *   橘寺: 14:45(誤)→15:01(正)
 * 藤原宮跡(16:27)は、正しい鎖でもちょうど16:27になるため変更なし(すき間なし、
 * 滞在30分もそのまま、終了16:57)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-84-27a60951-correction.ts
 *   反映: npm run prod -- npx tsx prisma/fix-84-27a60951-correction.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const KAMEISHI_ID = "0b076aec-c58d-4a91-95d5-f1ef6d507816";
const TAKAMATSUZUKA_ID = "6ce02298-fe93-4ff2-b1c2-45b9cf79b950";
const ISHIBUTAI_ID = "6c1ae3e4-71ff-4d0a-91f1-0fc85247aa90";
const TACHIBANADERA_ID = "1939ef15-2b48-415f-a5f3-e84ce940f77f";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const commit = process.argv.includes("--commit");

  console.log("=== #84 緊急訂正: 初日の時刻の計算違いを直す ===");
  console.log("亀石: 11:29 → 11:34");
  console.log("高松塚古墳: 12:14 → 12:34");
  console.log("石舞台古墳: 13:34 → 14:12");
  console.log("橘寺: 14:45 → 15:01");
  console.log("藤原宮跡: 16:27(変更なし、正しい鎖でもすき間なく16:27になる)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction([
    prisma.spot.update({ where: { id: KAMEISHI_ID }, data: { visitTime: t(11, 34) } }),
    prisma.spot.update({ where: { id: TAKAMATSUZUKA_ID }, data: { visitTime: t(12, 34) } }),
    prisma.spot.update({ where: { id: ISHIBUTAI_ID }, data: { visitTime: t(14, 12) } }),
    prisma.spot.update({ where: { id: TACHIBANADERA_ID }, data: { visitTime: t(15, 1) } }),
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

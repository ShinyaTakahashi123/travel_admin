/**
 * 出雲(21f198de)の訂正: 稲佐の浜の1文目に「手続きに15分ほど」を戻す。
 * itinerary-rules.md 59行目の決まり(レンタカーの日は手続き約15分を書く)により、
 * fix-winter-izumo.ts の直し6(企画運営の指摘で削除)は誤りだったため復元(企画運営 2026-11-02)。
 * 時刻・区間・分は変更しない(8:45+手続き15+運転16=9:16≒9:15ごろのまま)。最後の
 * 「返す手続きに15分ほど」は元から変更していない。
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-izumo-inasa-procedure.ts
 *   反映: npm run prod -- npx tsx prisma/fix-izumo-inasa-procedure.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const INASA_SPOT_ID = "8e02831c-94c5-48e7-bbdb-ff769a07bddd";
const FROM = "出雲市駅に8時45分ごろ着いたら、駅の近くでレンタカーを借りて、車でおよそ16分、稲佐の浜に着きます。";
const TO = "出雲市駅に8時45分ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ16分、稲佐の浜に着きます。";

async function main() {
  const commit = process.argv.includes("--commit");
  const spot = await prisma.spot.findUniqueOrThrow({ where: { id: INASA_SPOT_ID } });
  if (!spot.memo?.includes(FROM)) {
    console.log("想定した文が見つかりません。現在のメモ:");
    console.log(spot.memo);
    return;
  }
  const newMemo = spot.memo.replace(FROM, TO);
  console.log("直す前:", spot.memo);
  console.log("直した後:", newMemo);
  if (commit) {
    await prisma.spot.update({ where: { id: INASA_SPOT_ID }, data: { memo: newMemo } });
    console.log("書き込みました。");
  } else {
    console.log("(確認モード。--commit で書き込みます)");
  }
}
main().finally(() => prisma.$disconnect());

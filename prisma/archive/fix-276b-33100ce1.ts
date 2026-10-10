/**
 * #276 法務13:36・企画運営13:37の指摘。説明文に旧スポット名「島根ワイナリー」
 * が残っていた(本文はfix-276で出雲文化伝承館に差し替え済み)。説明文も直す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-276b-33100ce1.ts
 */
import { prisma } from "../src/lib/prisma";

const ITIN_ID = "33100ce1-b739-4342-826f-4de81880d252";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });

  const old = "1日目は日御碕の岬から島根ワイナリー・稲佐の浜へ、2日目は出雲大社から神門通り、旧大社駅へ。";
  const next = "1日目は日御碕の岬から出雲文化伝承館・稲佐の浜へ、2日目は出雲大社から神門通り、旧大社駅へ。";

  if (!itin.description?.includes(old)) {
    if (itin.description?.includes(next)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: itin.description.replace(old, next) } });
  console.log("description fixed: 島根ワイナリー → 出雲文化伝承館");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

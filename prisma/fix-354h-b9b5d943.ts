/**
 * #354の続き。本文の全体スキャンで見つかった口調の直し忘れ2件を修正。
 * - 国際通り: 「残っているわけです」→「残っています」(話し言葉の「〜わけです」)
 * - 波上護国寺: 「手を合わせてください」→「手を合わせましょう」(「〜てください」の統一)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-354h-b9b5d943.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b9b5d943-e02a-4013-95e8-89ca62f50842";
const KOKUSAIDORI_ID = "6bee409b-61ad-482e-891c-1e8ca00d2d05";
const GOKOKUJI_ID = "185d7d98-865c-4329-b1df-79f079b71df3";

async function main() {
  const kokusai = await prisma.spot.findUniqueOrThrow({ where: { id: KOKUSAIDORI_ID } });
  const old1 = "その名は今も通りの呼び名として残っているわけです。";
  const new1 = "その名は今も通りの呼び名として残っています。";
  if (kokusai.memo?.includes(old1)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: KOKUSAIDORI_ID }, { memo: kokusai.memo.replace(old1, new1) });
    console.log("国際通り: 口調を修正");
  } else {
    console.log("国際通り: 既に対応済み");
  }

  const gokokuji = await prisma.spot.findUniqueOrThrow({ where: { id: GOKOKUJI_ID } });
  const old2 = "静かに手を合わせてください。";
  const new2 = "静かに手を合わせましょう。";
  if (gokokuji.memo?.includes(old2)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: GOKOKUJI_ID }, { memo: gokokuji.memo.replace(old2, new2) });
    console.log("波上護国寺: 口調を修正");
  } else {
    console.log("波上護国寺: 既に対応済み");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

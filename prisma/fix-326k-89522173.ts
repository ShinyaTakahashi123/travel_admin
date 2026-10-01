/**
 * #326 湯畑の湯けむりと雪見の露天風呂。冬の草津でゆったり湯めぐり
 * 企画運営の再調査(10/1)で発覚した、つなぎのずれ修正。2か所。
 * 1. 湯畑の結びが、実際の次(白旗の湯・徒歩1分)ではなく、
 *    その次(光泉寺)を指していた。
 * 2. 温泉図書館(Day2)の結びが「10分」だが、実際の次(地蔵の湯)の
 *    記録・本文は「15分」(坂の上り下りで時間がかかる旨の記載あり)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-326k-89522173.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "89522173-3b95-4393-a808-5ed5d465d85b";

async function main() {
  const yubatake = await prisma.spot.findFirstOrThrow({ where: { name: "湯畑", day: { itineraryId: ITIN_ID } } });
  const toshokan = await prisma.spot.findFirstOrThrow({ where: { name: "温泉図書館", day: { itineraryId: ITIN_ID } } });

  const old1 = "続いては、歩いておよそ5分の光泉寺へ向かいましょう。";
  const next1 = "続いては、歩いてすぐの白旗の湯へ向かいましょう。";
  if (!yubatake.memo?.includes(old1)) {
    if (!yubatake.memo?.includes(next1)) throw new Error("湯畑: anchor not found");
    console.log("湯畑: already fixed, skipping");
  } else {
    await updateSpotInItinerary(ITIN_ID, { spotId: yubatake.id }, { memo: yubatake.memo.replace(old1, next1) });
    console.log("湯畑: closer fixed → 白旗の湯(徒歩すぐ)");
  }

  const old2 = "続いては、歩いておよそ10分の地蔵の湯へ向かいましょう。";
  const next2 = "続いては、歩いておよそ15分の地蔵の湯へ向かいましょう。";
  if (!toshokan.memo?.includes(old2)) {
    if (!toshokan.memo?.includes(next2)) throw new Error("温泉図書館: anchor not found");
    console.log("温泉図書館: already fixed, skipping");
  } else {
    await updateSpotInItinerary(ITIN_ID, { spotId: toshokan.id }, { memo: toshokan.memo.replace(old2, next2) });
    console.log("温泉図書館: closer fixed → 地蔵の湯(徒歩15分)");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

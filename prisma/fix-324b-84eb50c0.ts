/**
 * #324の続き(自己チェックの気づき)。
 * 1. 福澤諭吉旧居・福澤記念館のtransitDurationMinが、旧い値(15、なかはく
 *    追加前の直行の値)のまま残っていた(itinerary-audit「時刻の計算が
 *    合わない」で検出)。実際の値(8分)に修正。
 * 2. prayer-check.cjsの判定語(「敬意」「手を合わせ」)に合致する一文が、
 *    寺町・自性寺になかったため追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-324b-84eb50c0.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "84eb50c0-577b-428d-9200-80b8a8f2fedb";

async function main() {
  const fukuzawa = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "福澤諭吉旧居・福澤記念館" },
  });
  if (fukuzawa.transitDurationMin === 15) {
    await updateSpotInItinerary(ITIN_ID, { spotId: fukuzawa.id }, { transitDurationMin: 8 });
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: fukuzawa.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: fukuzawa.id, orderNo: 1, transitMode: "walk", transitDurationMin: 8 },
    });
  }

  const teramachi = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "寺町" },
  });
  {
    const old = "城下町ならではの静かな町並みを、ゆっくりと散策してみましょう。";
    const next = "城下町ならではの静かな町並みを、寺院には敬意をもって、ゆっくりと散策してみましょう。";
    if (teramachi.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: teramachi.id }, { memo: teramachi.memo.replace(old, next) });
    }
  }

  const jishoji = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "自性寺" },
  });
  {
    const old = "歴史ある寺院で、貴重な文人画の世界にふれてみましょう。";
    const next = "歴史ある寺院に、静かに、敬意をもってお参りし、貴重な文人画の世界にふれてみましょう。";
    if (jishoji.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: jishoji.id }, { memo: jishoji.memo.replace(old, next) });
    }
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

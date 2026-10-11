/**
 * #357の続き。prayer-check.cjsの指摘: 興福寺・崇福寺は今も活動する寺院のため、
 * 祈りの配慮の一文を追加する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-357b-bd33014d.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "bd33014d-d57d-49c2-b7a7-3c34456fa368";

async function main() {
  const kofukuji = await prisma.spot.findFirstOrThrow({ where: { name: "興福寺", day: { itineraryId: ITIN_ID } } });
  const old1 = "鎖国時代の長崎に根づいた異国文化に触れてみましょう。";
  const new1 = "鎖国時代の長崎に根づいた異国文化に触れてみましょう。今も信仰の場ですので、静かに、敬意をもって見学しましょう。";
  if (kofukuji.memo?.includes(old1)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: kofukuji.id }, { memo: kofukuji.memo.replace(old1, new1) });
    console.log("興福寺: 祈りの一文を追加");
  } else {
    console.log("興福寺: 既に対応済み");
  }

  const sofukuji = await prisma.spot.findFirstOrThrow({ where: { name: "崇福寺", day: { itineraryId: ITIN_ID } } });
  const old2 = "もう一つの異国文化の姿を見学しましょう。";
  const new2 = "もう一つの異国文化の姿を見学しましょう。今も信仰の場ですので、静かに、敬意をもって見学しましょう。";
  if (sofukuji.memo?.includes(old2)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: sofukuji.id }, { memo: sofukuji.memo.replace(old2, new2) });
    console.log("崇福寺: 祈りの一文を追加");
  } else {
    console.log("崇福寺: 既に対応済み");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

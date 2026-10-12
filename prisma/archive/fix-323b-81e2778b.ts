/**
 * #323の続き(自己チェックの気づき)。
 * 1. 湯之平展望所のtransitMode/transitDurationMinが、旧い値(car/30、
 *    差し替え前の直行の値)のまま残っていた(itinerary-audit「時刻の計算が
 *    合わない」「車と公共交通が混在」で検出)。バス/35分に修正。
 * 2. 桜島フェリー「全国で唯一となる24時間運航」、湯之平展望所「最も高い
 *    場所にあります」の言い切りに、決まり9のヘッジを追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-323b-81e2778b.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "81e2778b-4a9f-4594-93a2-1bde60bae8ca";

async function main() {
  const yunohira = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "湯之平展望所" },
  });
  if (yunohira.transitMode === "car") {
    const old = "桜島の中で一般に開放されている展望所としては最も高い場所にあります。";
    const next = "桜島の中で一般に開放されている展望所としては最も高い場所とされています。";
    const memo = (yunohira.memo ?? "").replace(old, next);
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: yunohira.id },
      { memo, transitMode: "bus", transitDurationMin: 35 }
    );
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: yunohira.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: yunohira.id, orderNo: 1, transitMode: "bus", transitDurationMin: 35 },
    });
  }

  const ferry = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "桜島フェリー" },
  });
  {
    const old = "フェリーとしては全国で唯一となる24時間運航を続けてきました。";
    const next = "フェリーとしては全国で唯一とされる24時間運航を続けてきました。";
    if (ferry.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: ferry.id }, { memo: ferry.memo.replace(old, next) });
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

/**
 * #321の続き(自己チェックの気づき)。
 * fix-321で3点、更新漏れ・記載漏れがあった(itinerary-audit・flow-check検出)。
 * 1. 石段街のtransitMode/transitDurationMinが、旧い値(car/15、旧・伊香保
 *    神社追加前の値)のまま残っていた。伊香保神社からの実際の値(walk/6)に
 *    修正。
 * 2. 河鹿橋のvisitTimeを09:00に変更し忘れ、旧い値(09:30)のまま残っていた。
 *    09:00に修正。
 * 3. 2日目に昼食の一言がなかった。見晴・伊香保森林公園(11:24着、昼どきに
 *    かかる)に追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-321b-7f723012.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "7f723012-6fc6-4ba2-9c16-1d38bcf7540e";

async function main() {
  const ishidan = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "石段街" },
  });
  if (ishidan.transitMode === "car") {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: ishidan.id },
      { transitMode: "walk", transitDurationMin: 6 }
    );
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: ishidan.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: ishidan.id, orderNo: 1, transitMode: "walk", transitDurationMin: 6 },
    });
  }

  const kajikabashi = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "河鹿橋" },
  });
  if (kajikabashi.visitTime?.getUTCHours() === 9 && kajikabashi.visitTime?.getUTCMinutes() === 30) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: kajikabashi.id },
      { visitTime: new Date(Date.UTC(1970, 0, 1, 9, 0)) }
    );
  }

  const miharashi = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "見晴・伊香保森林公園" },
  });
  const old = "展望台からの眺めを楽しんだあとは、";
  const next = "到着したら、まずこのあたりで昼食をとりましょう。展望台からの眺めを楽しんだあとは、";
  if (miharashi.memo?.includes(old) && !miharashi.memo.includes("昼食をとりましょう")) {
    await updateSpotInItinerary(ITIN_ID, { spotId: miharashi.id }, { memo: miharashi.memo.replace(old, next) });
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

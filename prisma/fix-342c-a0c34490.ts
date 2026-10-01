/**
 * #342の続き。prayer-checkで、現役の宗教施設(弘前昇天教会・最勝院)に
 * 配慮の一文がないと出た。それぞれ一文を追加する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-342c-a0c34490.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "a0c34490-4b62-4f3f-8162-5802cf5d401d";

async function main() {
  const church = await prisma.spot.findFirstOrThrow({ where: { name: "弘前昇天教会", day: { itineraryId: ITIN_ID } } });
  const saishoin = await prisma.spot.findFirstOrThrow({ where: { name: "最勝院", day: { itineraryId: ITIN_ID } } });

  const churchOld = "見学できるのは外観のみで、雪に映える赤レンガの美しさを味わいましょう。";
  const churchNext = "今も礼拝が続く現役の教会ですので、見学の際は静かに、節度をもって見て回りましょう。見学できるのは外観のみで、雪に映える赤レンガの美しさを味わいましょう。";

  const saishoinOld = "雪をまとった五重塔の姿を、じっくりと仰いでみましょう。";
  const saishoinNext = "今も祈りが続く聖地ですので、境内では静かに、敬意をもってお参りしましょう。雪をまとった五重塔の姿を、じっくりと仰いでみましょう。";

  if (church.memo?.includes(churchOld)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: church.id }, { memo: church.memo.replace(churchOld, churchNext) });
    console.log("church courtesy line added");
  } else if (church.memo?.includes(churchNext)) {
    console.log("church already fixed, skipping");
  } else {
    throw new Error("church anchor not found");
  }

  if (saishoin.memo?.includes(saishoinOld)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: saishoin.id }, { memo: saishoin.memo.replace(saishoinOld, saishoinNext) });
    console.log("saishoin courtesy line added");
  } else if (saishoin.memo?.includes(saishoinNext)) {
    console.log("saishoin already fixed, skipping");
  } else {
    throw new Error("saishoin anchor not found");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #347の続き。itinerary-auditで3件の指摘。
 * 1) 「雪の大谷」の名前を「室堂」に変え忘れていた(名前のrenameを入れ忘れ)。
 * 2) 美女平(63分)→室堂の移動で、間57分/移動50分の時刻のずれ。美女平の
 *    滞在を70分に直し、立山駅からの7分の移動分も含めて正しく積算する。
 * 3) 室堂「立山黒部アルペンルート最大の拠点です」(言い切り)を、誇張の
 *    ない表現に直す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-347b-aec8eadc.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "aec8eadc-75da-4179-8c8c-013bb4b3c01f";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const bijodaira = await prisma.spot.findFirstOrThrow({ where: { name: "美女平", day: { itineraryId: ITIN_ID } } });
  const murodo = await prisma.spot.findFirstOrThrow({ where: { name: "雪の大谷", day: { itineraryId: ITIN_ID } } });

  if (murodo.name === "室堂") {
    console.log("already fixed, skipping");
    return;
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: bijodaira.id }, { stayDurationMin: 70 });
  console.log("bijodaira stay fixed to 70min");

  const murodoOld = "立山黒部アルペンルート最大の拠点です。";
  const murodoNext = "立山黒部アルペンルートの中心となる拠点です。";
  if (!murodo.memo?.includes(murodoOld)) throw new Error("murodo anchor not found");

  await prisma.spot.update({
    where: { id: murodo.id },
    data: { name: "室堂", memo: murodo.memo.replace(murodoOld, murodoNext), visitTime: t(11, 30) },
  });
  console.log("murodo renamed and wording fixed, visitTime confirmed at 11:30");

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

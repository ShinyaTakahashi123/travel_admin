/**
 * #349の続き。法務12:45の指摘2点+できれば1点に対応。
 * 1) 青島亜熱帯植物園「(宮交ボタニックガーデン青島)」はネーミングライツの
 *    呼び名のため外す。
 * 2) 飫肥城下町(重伝建、今も人が暮らす武家屋敷)に、住民への配慮の一文を
 *    追加。
 * 3) (できれば)青島神社「あらゆる和合をもたらす神様として信仰されて
 *    います」をご利益に近い言い方から「縁結びの神様として親しまれて
 *    います」に和らげる。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-349f-af30d135.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "af30d135-b7e7-4a4e-b6f1-dec242afcdb9";

async function main() {
  const garden = await prisma.spot.findFirstOrThrow({ where: { name: "青島亜熱帯植物園", day: { itineraryId: ITIN_ID } } });
  const obi = await prisma.spot.findFirstOrThrow({ where: { name: "飫肥城下町", day: { itineraryId: ITIN_ID } } });
  const aoshima = await prisma.spot.findFirstOrThrow({ where: { name: "青島神社", day: { itineraryId: ITIN_ID } } });

  const gardenOld = "青島亜熱帯植物園(宮交ボタニックガーデン青島)は、青島に自生する亜熱帯植物群落の保護研究を目的に整備された植物園です。";
  const gardenNext = "青島亜熱帯植物園は、青島に自生する亜熱帯植物群落の保護研究を目的に整備された植物園です。";
  if (!garden.memo?.includes(gardenOld)) throw new Error("garden anchor not found");

  const obiOld = "石畳の道をゆっくりと歩きながら、江戸時代から続く城下町の面影を感じてみましょう。";
  const obiNext =
    "武家屋敷には今も人が暮らす家もあるので、敷地には入らず、静かに歩きましょう。石畳の道をゆっくりと歩きながら、江戸時代から続く城下町の面影を感じてみましょう。";
  if (!obi.memo?.includes(obiOld)) throw new Error("obi anchor not found");

  const aoshimaOld = "御祭神は、海幸・山幸の神話で知られる彦火々出見命と、その后・豊玉姫命で、縁結びをはじめ、あらゆる和合をもたらす神様として信仰されています。";
  const aoshimaNext = "御祭神は、海幸・山幸の神話で知られる彦火々出見命と、その后・豊玉姫命で、縁結びの神様として親しまれています。";
  if (!aoshima.memo?.includes(aoshimaOld)) throw new Error("aoshima anchor not found");

  await updateSpotInItinerary(ITIN_ID, { spotId: garden.id }, { memo: garden.memo.replace(gardenOld, gardenNext) });
  console.log("garden: naming-rights name removed");

  await updateSpotInItinerary(ITIN_ID, { spotId: obi.id }, { memo: obi.memo.replace(obiOld, obiNext) });
  console.log("obi: resident-privacy line added");

  await updateSpotInItinerary(ITIN_ID, { spotId: aoshima.id }, { memo: aoshima.memo.replace(aoshimaOld, aoshimaNext) });
  console.log("aoshima: wording softened");

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

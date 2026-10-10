/**
 * #344の続き。法務11:15の指摘3点+できれば2点に対応。
 * 1) 伊香保グリーン牧場(エサやり・なでる)に、動物への一言を追加。
 * 2) 伊香保露天風呂に、入浴の一言を追加。
 * 3) 水澤寺「日本三大うどんの一つに数えられる」→「ともいわれる」。
 * 4) (できれば)伊香保石段街(365段)に足元の一言を追加。
 * 5) (できれば)榛名湖の貸しボートに係員の案内に従う一言を追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-344b-a8d24b41.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "a8d24b41-ba0b-4c96-944e-5d2be0e4433b";

async function main() {
  const bokujo = await prisma.spot.findFirstOrThrow({ where: { name: "伊香保グリーン牧場", day: { itineraryId: ITIN_ID } } });
  const mizusawadera = await prisma.spot.findFirstOrThrow({ where: { name: "水澤寺", day: { itineraryId: ITIN_ID } } });
  const ishidangai = await prisma.spot.findFirstOrThrow({ where: { name: "伊香保石段街", day: { itineraryId: ITIN_ID } } });
  const rotenburo = await prisma.spot.findFirstOrThrow({ where: { name: "伊香保露天風呂", day: { itineraryId: ITIN_ID } } });
  const harunako = await prisma.spot.findFirstOrThrow({ where: { name: "榛名湖", day: { itineraryId: ITIN_ID } } });

  const bokujoOld = "動物たちにエサをあげたり、なでたりしながら、高原の爽やかな空気の中でゆったりとした時間を過ごしましょう。";
  const bokujoNext =
    "動物たちにエサをあげたり、なでたりしながら、高原の爽やかな空気の中でゆったりとした時間を過ごしましょう。エサやりやふれあいは係員の案内に従い、動物にさわったあとは手を洗いましょう。";
  if (!bokujo.memo?.includes(bokujoOld)) throw new Error("bokujo anchor not found");

  const mizusawaderaOld = "日本三大うどんの一つに数えられる水沢うどんの店";
  const mizusawaderaNext = "日本三大うどんの一つともいわれる水沢うどんの店";
  if (!mizusawadera.memo?.includes(mizusawaderaOld)) throw new Error("mizusawadera anchor not found");

  const ishidangaiOld = "子どもたちと一緒に、賑やかな温泉街の雰囲気を味わいながら石段を上ってみましょう。";
  const ishidangaiNext =
    "石段には勾配があるので、小さな子ども連れは足元に気をつけましょう。子どもたちと一緒に、賑やかな温泉街の雰囲気を味わいながら石段を上ってみましょう。";
  if (!ishidangai.memo?.includes(ishidangaiOld)) throw new Error("ishidangai anchor not found");

  const rotenburoOld = "鉄分を含む茶褐色のお湯に浸かりながら、高原の澄んだ空気と木々の緑を楽しみましょう。";
  const rotenburoNext =
    "浴場では、ほかの入浴客が写らないよう撮影は控え、長湯を避けて水分をとりながら楽しみましょう。鉄分を含む茶褐色のお湯に浸かりながら、高原の澄んだ空気と木々の緑を楽しみましょう。";
  if (!rotenburo.memo?.includes(rotenburoOld)) throw new Error("rotenburo anchor not found");

  const harunakoOld = "貸しボートや白鳥の形をしたスワンボートで、湖上の散策を楽しむこともできます。";
  const harunakoNext =
    "貸しボートや白鳥の形をしたスワンボートで、湖上の散策を楽しむこともできます。ボートを利用する際は、係員の案内に従いましょう。";
  if (!harunako.memo?.includes(harunakoOld)) throw new Error("harunako anchor not found");

  await updateSpotInItinerary(ITIN_ID, { spotId: bokujo.id }, { memo: bokujo.memo.replace(bokujoOld, bokujoNext) });
  console.log("bokujo: animal-contact safety line added");

  await updateSpotInItinerary(ITIN_ID, { spotId: mizusawadera.id }, { memo: mizusawadera.memo.replace(mizusawaderaOld, mizusawaderaNext) });
  console.log("mizusawadera: hedge softened");

  await updateSpotInItinerary(ITIN_ID, { spotId: ishidangai.id }, { memo: ishidangai.memo.replace(ishidangaiOld, ishidangaiNext) });
  console.log("ishidangai: footing caution added");

  await updateSpotInItinerary(ITIN_ID, { spotId: rotenburo.id }, { memo: rotenburo.memo.replace(rotenburoOld, rotenburoNext) });
  console.log("rotenburo: bathing etiquette added");

  await updateSpotInItinerary(ITIN_ID, { spotId: harunako.id }, { memo: harunako.memo.replace(harunakoOld, harunakoNext) });
  console.log("harunako: boat safety added");

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

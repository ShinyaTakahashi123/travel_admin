/**
 * #340の続き。itinerary-audit.cjsの「徒歩が速すぎ」指摘に対応。
 * 大宰府展示館(0.6km/3分)・客館跡(0.9km/5分)が、実際の距離に対して
 * 速すぎる設定だったため、大宰府展示館への移動を7分、客館跡への移動を
 * 11分に直し、それに伴う後続スポットのvisitTimeを再計算した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-340b-9f58d4de.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "9f58d4de-de1f-4ee2-9719-0aeadfc7fd0f";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const tenjikan = await prisma.spot.findFirstOrThrow({ where: { name: "大宰府展示館", day: { itineraryId: ITIN_ID } } });
  if (tenjikan.transitDurationMin !== 7) {
    await updateSpotInItinerary(ITIN_ID, { spotId: tenjikan.id }, { transitDurationMin: 7, visitTime: t(12, 3) });
    console.log("tenjikan transit 3->7, visitTime -> 12:03");
  } else {
    console.log("tenjikan already fixed");
  }

  const kyakkanato = await prisma.spot.findFirstOrThrow({ where: { name: "客館跡", day: { itineraryId: ITIN_ID } } });
  if (kyakkanato.transitDurationMin !== 11) {
    await updateSpotInItinerary(ITIN_ID, { spotId: kyakkanato.id }, { transitDurationMin: 11, visitTime: t(12, 44) });
    console.log("kyakkanato transit 5->11, visitTime -> 12:44");
  } else {
    console.log("kyakkanato already fixed");
  }

  const enokisha = await prisma.spot.findFirstOrThrow({ where: { name: "榎社", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: enokisha.id }, { visitTime: t(13, 14) });
  console.log("enokisha visitTime -> 13:14");

  const sakamoto = await prisma.spot.findFirstOrThrow({ where: { name: "坂本八幡宮", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: sakamoto.id }, { visitTime: t(13, 56) });
  console.log("sakamoto hachimangu visitTime -> 13:56");

  const kokubunji = await prisma.spot.findFirstOrThrow({ where: { name: "筑前国分寺跡", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: kokubunji.id }, { visitTime: t(15, 11) });
  console.log("chikuzen kokubunji visitTime -> 15:11");

  const kamado = await prisma.spot.findFirstOrThrow({ where: { name: "竈門神社", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: kamado.id }, { visitTime: t(15, 56) });
  console.log("kamado jinja visitTime -> 15:56");

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

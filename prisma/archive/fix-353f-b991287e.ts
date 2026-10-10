/**
 * #353の続き。企画運営15:13の指摘: fix-353eで民家園→明善寺の移動時間を
 * 20→9分に縮めた際、浮いた11分を民家園の滞在(115→126分)に足したのは、
 * 移動時間の短縮分を滞在に回す決まりA違反にあたるとの指摘。民家園を
 * 115分に戻し、後ろの時刻を繰り上げた。1日目の終わりが16:30を切った分
 * (3分)は、白川郷の湯の滞在を80→85分に、わずかに調整して埋めた
 * (企画運営が示した60〜90分の目安の範囲内)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-353f-b991287e.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b991287e-ca74-46a8-a190-55ce8cd37fe0";

async function main() {
  const minkaen = await prisma.spot.findFirstOrThrow({ where: { name: "野外博物館合掌造り民家園", day: { itineraryId: ITIN_ID } } });
  const meizenji = await prisma.spot.findFirstOrThrow({ where: { name: "明善寺郷土館", day: { itineraryId: ITIN_ID } } });
  const nagaseke = await prisma.spot.findFirstOrThrow({ where: { name: "長瀬家", day: { itineraryId: ITIN_ID } } });
  const wadake = await prisma.spot.findFirstOrThrow({ where: { name: "和田家", day: { itineraryId: ITIN_ID } } });
  const tenbodai = await prisma.spot.findFirstOrThrow({ where: { name: "荻町城跡展望台", day: { itineraryId: ITIN_ID } } });
  const onsen = await prisma.spot.findFirstOrThrow({ where: { name: "白川郷の湯", day: { itineraryId: ITIN_ID } } });

  if (minkaen.stayDurationMin === 115 && onsen.stayDurationMin === 85) {
    console.log("already applied, skipping");
    return;
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: minkaen.id }, { stayDurationMin: 115 });
  await updateSpotInItinerary(ITIN_ID, { spotId: meizenji.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 11, 34)) });
  await updateSpotInItinerary(ITIN_ID, { spotId: nagaseke.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 12)) });
  await updateSpotInItinerary(ITIN_ID, { spotId: wadake.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 56)) });
  await updateSpotInItinerary(ITIN_ID, { spotId: tenbodai.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 24)) });
  await updateSpotInItinerary(ITIN_ID, { spotId: onsen.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 7)), stayDurationMin: 85 });

  console.log("民家園を115分に戻し、後続の時刻を繰り上げ。白川郷の湯を85分に調整して16:32着地");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #340の続き。fix-340eでvisitTimeの積算を誤り、戒壇院・客館跡の到着が
 * 直前のスポットの終了時刻より早くなっていた(時刻の計算が合わない)。
 * 正しい値に修正する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-340f-9f58d4de.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "9f58d4de-de1f-4ee2-9719-0aeadfc7fd0f";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const kaidanin = await prisma.spot.findFirstOrThrow({ where: { name: "戒壇院", day: { itineraryId: ITIN_ID } } });
  const kaidaninTarget = t(10, 0);
  if (kaidanin.visitTime?.getTime() !== kaidaninTarget.getTime()) {
    await updateSpotInItinerary(ITIN_ID, { spotId: kaidanin.id }, { visitTime: kaidaninTarget });
    console.log("kaidanin visitTime -> 10:00");
  } else {
    console.log("kaidanin already correct");
  }

  const kyakkanato = await prisma.spot.findFirstOrThrow({ where: { name: "客館跡", day: { itineraryId: ITIN_ID } } });
  const kyakkanatoTarget = t(10, 44);
  if (kyakkanato.visitTime?.getTime() !== kyakkanatoTarget.getTime()) {
    await updateSpotInItinerary(ITIN_ID, { spotId: kyakkanato.id }, { visitTime: kyakkanatoTarget });
    console.log("kyakkanato visitTime -> 10:44");
  } else {
    console.log("kyakkanato already correct");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

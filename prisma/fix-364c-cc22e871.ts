/**
 * #364の続き。fix-364bで堀内で昼食の座標を修正したことで、萩城跡からの徒歩3分が
 * 速すぎる(0.3km/3分≒7km/h)と出たため、5分に修正する(itinerary-audit.cjsで発見)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-364c-cc22e871.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "cc22e871-bc53-4fdd-b777-5a5b47d934a5";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const horiuchi = await prisma.spot.findFirstOrThrow({ where: { name: "堀内で昼食", day: { itineraryId: ITIN_ID } } });
  if (horiuchi.visitTime?.toISOString().slice(11, 16) === "12:35") {
    console.log("既に対応済み");
    return;
  }
  await updateSpotInItinerary(ITIN_ID, { spotId: horiuchi.id }, {
    visitTime: T(12, 35),
    transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
  });
  console.log("堀内で昼食: 徒歩を3分→5分に修正、到着時刻を12:35に修正");

  const hamasaki = await prisma.spot.findFirstOrThrow({ where: { name: "浜崎", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: hamasaki.id }, { visitTime: T(13, 57) });
  console.log("浜崎: 到着時刻を13:57に修正(堀内の滞在終了13:35+徒歩22分)");

  const shoka = await prisma.spot.findFirstOrThrow({ where: { name: "松下村塾", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: shoka.id }, { visitTime: T(14, 57) });
  console.log("松下村塾: 到着時刻を14:57に修正(浜崎の滞在終了14:37+バス20分)");

  const tokoji = await prisma.spot.findFirstOrThrow({ where: { name: "東光寺", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: tokoji.id }, { visitTime: T(15, 47) });
  console.log("東光寺: 到着時刻を15:47に修正(松下村塾の滞在終了15:37+徒歩10分)");

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #353の続き。fix-353cで相倉集落→道の駅白川郷の移動時間をtransitDurationMin
 * では26分に直したが、本文中の「車でおよそ24分」(菅沼集落→道の駅だった
 * ころの古い数字)を直し忘れており、itinerary-auditで不一致を確認。
 * 本文を26分に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-353d-b991287e.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b991287e-ca74-46a8-a190-55ce8cd37fe0";

async function main() {
  const michinoeki = await prisma.spot.findFirstOrThrow({ where: { name: "道の駅白川郷", day: { itineraryId: ITIN_ID } } });

  const old = "相倉集落を見学したら、車でおよそ24分の道の駅白川郷へ向かいましょう。";
  const next = "相倉集落を見学したら、車でおよそ26分の道の駅白川郷へ向かいましょう。";

  if (!michinoeki.memo?.includes(old)) {
    if (michinoeki.memo?.includes(next)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: michinoeki.id }, { memo: michinoeki.memo.replace(old, next) });
  console.log("道の駅白川郷: 書き出しの分数を26分に修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

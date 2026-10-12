/**
 * #354の続き。fix-354iで玉陵の口調を直した際、誤って玉陵への移動分数(園比屋武御嶽石門→
 * 玉陵)を2分に書き換えてしまっていた(本来は変更不要だった)。実距離約240mに対して
 * 2分は速すぎる(itinerary-audit.cjsで検出)ため、4分に戻す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-354k-b9b5d943.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b9b5d943-e02a-4013-95e8-89ca62f50842";
const TAMAUDUN_ID = "c24d3305-ef33-46e7-a64c-19f9ed0ae671";

async function main() {
  const spot = await prisma.spot.findUniqueOrThrow({ where: { id: TAMAUDUN_ID }, include: { transitLegs: true } });
  if (spot.transitLegs[0]?.transitDurationMin === 4) {
    console.log("already applied, skipping");
    return;
  }
  await updateSpotInItinerary(ITIN_ID, { spotId: TAMAUDUN_ID }, {
    transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
  });
  console.log("玉陵: 園比屋武御嶽石門からの移動分数を4分に修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

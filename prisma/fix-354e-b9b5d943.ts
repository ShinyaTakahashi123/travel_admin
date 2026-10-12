/**
 * #354 Day1続き。fix-354dで書いた移動分数が、実際のスケジュール上のすき間と
 * 合っていなかった6件を、実際の距離に基づいて修正(視察時刻は変更せず、
 * 申告する移動分数だけを実態に合わせる)。
 * - 久慶門→園比屋武御嶽石門: 4→2分(実距離約104m)
 * - 園比屋武御嶽石門→玉陵: 7→4分(実距離約240m)
 * - 玉陵→首里の食事処: 5→9分(座標の見直しで実距離が約753mに、徒歩9分が妥当)
 * - 首里の食事処→継世門: 6→3分(実距離約153m)
 * - 継世門→首里金城町石畳道: 10→6分(実距離約435m)
 * - 識名宮→識名園: 25→10分(実距離約709m)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-354e-b9b5d943.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b9b5d943-e02a-4013-95e8-89ca62f50842";

const fixes: { spotId: string; min: number }[] = [
  { spotId: "e24da1ca-8012-42f8-a72e-9db374975f1d", min: 2 }, // 園比屋武御嶽石門
  { spotId: "c24d3305-ef33-46e7-a64c-19f9ed0ae671", min: 4 }, // 玉陵
  { spotId: "2e4ce302-40bb-4011-a922-1e3cb8ca481e", min: 9 }, // 首里の食事処で昼食
  // 継世門・石畳道・識名園は実行時に名前で解決(新規作成分はID未確定だったため)
];

async function main() {
  for (const f of fixes) {
    const spot = await prisma.spot.findUniqueOrThrow({ where: { id: f.spotId }, include: { transitLegs: true } });
    if (spot.transitLegs[0]?.transitDurationMin === f.min) continue;
    await updateSpotInItinerary(ITIN_ID, { spotId: f.spotId }, {
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: f.min }] },
    });
  }

  const nameFixes: { name: string; min: number }[] = [
    { name: "継世門", min: 3 },
    { name: "首里金城町石畳道", min: 6 },
    { name: "識名園", min: 10 },
  ];
  for (const f of nameFixes) {
    const spot = await prisma.spot.findFirstOrThrow({ where: { name: f.name, day: { itineraryId: ITIN_ID } }, include: { transitLegs: true } });
    if (spot.transitLegs[0]?.transitDurationMin === f.min) continue;
    await updateSpotInItinerary(ITIN_ID, { spotId: spot.id }, {
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: f.min }] },
    });
  }

  console.log("Day1の移動分数6件を実距離に合わせて修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

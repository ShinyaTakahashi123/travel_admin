/**
 * #343の続き。fix-343で少林山達磨寺を「高崎駅西口からバスでおよそ30分」と
 * 書きながら、次のスポットからは車(観音山公園へ車15分)に切り替えていて、
 * 手段の説明がなかった(決まり違反)。少林山達磨寺の書き出しを、最初から
 * レンタカーを借りて車で向かう形に直し、以降の車移動と整合させる。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-343b-a4ee710d.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "a4ee710d-7872-4fb5-8bb1-6b7b796cdcbd";

async function main() {
  const darumaji = await prisma.spot.findFirstOrThrow({ where: { name: "少林山達磨寺", day: { itineraryId: ITIN_ID } } });

  const old = "高崎さんぽの1日目は、少林山達磨寺からスタートです。高崎駅西口からバスでおよそ30分、黄檗宗の寺院で、";
  const next = "高崎さんぽの1日目は、少林山達磨寺からスタートです。高崎駅前でレンタカーを借り、車でおよそ30分の道のりです。黄檗宗の寺院で、";

  if (!darumaji.memo?.includes(old)) {
    if (darumaji.memo?.includes(next)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: darumaji.id }, { memo: darumaji.memo.replace(old, next) });
  console.log("darumaji opener updated to establish rental car from the start");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

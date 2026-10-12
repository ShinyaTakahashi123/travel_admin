/**
 * #356の続き。企画運営の指摘: レンタカーをどこで借り、どこへ戻すのかがなかった。
 * のと里山空港を起点・終点とする(總持寺祖院までのと里山空港から車で約25分、
 * イカの駅つくモールからのと里山空港まで車で約40分)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-356f-bc73fb84.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "bc73fb84-1fc8-4d6f-a6a7-39a20d7f76f5";

async function main() {
  const soin = await prisma.spot.findFirstOrThrow({ where: { name: "總持寺祖院", day: { itineraryId: ITIN_ID } } });
  const old1 = "のと里山海道を経て、能登半島ドライブの旅は總持寺祖院(そうじじそいん)から始まります。";
  const new1 = "のと里山空港の近くでレンタカーを借りて、車でおよそ25分、能登半島ドライブの旅は總持寺祖院(そうじじそいん)から始まります。";
  if (soin.memo?.includes(old1)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: soin.id }, { memo: soin.memo.replace(old1, new1) });
    console.log("總持寺祖院: レンタカーの出発地点を追加");
  } else {
    console.log("總持寺祖院: 既に対応済み");
  }

  const ikanoeki = await prisma.spot.findFirstOrThrow({ where: { name: "イカの駅つくモール", day: { itineraryId: ITIN_ID } } });
  const old2 = "九十九湾を眺めながら、のと里山海道を経て帰りの運転を楽しみ、能登半島ドライブの旅を締めくくりましょう。";
  const new2 = "九十九湾を眺めたら、車でおよそ40分ののと里山空港へ戻り、レンタカーを返しましょう。能登半島ドライブの旅を締めくくりましょう。";
  if (ikanoeki.memo?.includes(old2)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: ikanoeki.id }, { memo: ikanoeki.memo.replace(old2, new2) });
    console.log("イカの駅つくモール: レンタカーの返却地点を追加");
  } else {
    console.log("イカの駅つくモール: 既に対応済み");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

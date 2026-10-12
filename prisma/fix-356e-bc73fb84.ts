/**
 * #356の続き。法務10/11 10:58(記録2884ae2)の指摘3点に対応。
 * 1. 見附島の結び「海と大地が刻んできた、能登半島の自然の力強さを感じてみましょう」
 *    は、地震で崩れた話のすぐあとで、被災を「自然の力強さ」として味わうように
 *    読めるため、「今の姿を静かに眺めましょう」に差し替え。
 * 2. 總持寺祖院に、道路の通行止め・規制と、復旧作業や地域の暮らしの妨げにならない
 *    よう気をつける一文を追加。
 * 3. 座標を実点に修正: 總持寺祖院→node 5536923122「総持寺」37.286722,136.770104、
 *    白米千枚田→node 6417776188「白米千枚田」37.425699,136.999029。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-356e-bc73fb84.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "bc73fb84-1fc8-4d6f-a6a7-39a20d7f76f5";

async function main() {
  const soin = await prisma.spot.findFirstOrThrow({ where: { name: "總持寺祖院", day: { itineraryId: ITIN_ID } } });
  const old1 = "見学の際は、あらかじめ拝観の予約状況を公式サイトで確かめましょう。";
  const new1 = "見学の際は、あらかじめ拝観の予約状況を公式サイトで確かめましょう。能登半島では道路の通行止めや規制があることもあるので、出かける前に最新の道路情報を確かめ、復旧の作業や地域の暮らしの妨げにならないよう気をつけましょう。";
  if (soin.memo?.includes(old1)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: soin.id }, {
      memo: soin.memo.replace(old1, new1),
      lat: 37.286722,
      lng: 136.770104,
    });
    console.log("總持寺祖院: 道路情報の一文を追加、座標を実点に修正");
  } else {
    console.log("總持寺祖院: 既に対応済み");
  }

  const senmaida = await prisma.spot.findFirstOrThrow({ where: { name: "白米千枚田", day: { itineraryId: ITIN_ID } } });
  if (senmaida.lat?.toString() !== "37.425699") {
    await updateSpotInItinerary(ITIN_ID, { spotId: senmaida.id }, { lat: 37.425699, lng: 136.999029 });
    console.log("白米千枚田: 座標を実点に修正");
  } else {
    console.log("白米千枚田: 既に対応済み");
  }

  const mitsukejima = await prisma.spot.findFirstOrThrow({ where: { name: "見附島", day: { itineraryId: ITIN_ID } } });
  const old2 = "海と大地が刻んできた、能登半島の自然の力強さを感じてみましょう。";
  const new2 = "今の見附島の姿を、静かに眺めましょう。";
  if (mitsukejima.memo?.includes(old2)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: mitsukejima.id }, { memo: mitsukejima.memo.replace(old2, new2) });
    console.log("見附島: 結びの一文を修正");
  } else {
    console.log("見附島: 既に対応済み");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

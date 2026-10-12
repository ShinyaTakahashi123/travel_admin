/**
 * #365の続き。法務の指摘(記録d1e77e3・訂正4e34e0a)に対応。
 * ① 雄島の岩場に安全の一文を追加。
 * ② 座標2件: 北潟湖は丸めた値だったため、OSM way183540059(湖)の中心
 *    (36.272343,136.240799)に修正。蓮如上人記念館はどの点とも合わなかったため、
 *    OSM node1420945696「吉崎蓮如上人記念館」(36.289273,136.251259)に修正。
 * (参考) 北潟湖に、サイクリング時の周囲への配慮の一文を追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-365b-cc834a5c.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "cc834a5c-b2ba-4fc4-badc-cb841a216d17";

async function main() {
  const kitagata = await prisma.spot.findFirstOrThrow({ where: { name: "北潟湖", day: { itineraryId: ITIN_ID } } });
  const oldKitagata = "風を感じながらのサイクリングで、あわらの自然をゆったりと楽しみましょう。";
  const newKitagata =
    "風を感じながらのサイクリングで、あわらの自然をゆったりと楽しみましょう。歩行者や他の利用者とすれ違うこともあるため、スピードを控えめにし、周囲に気をつけましょう。";
  if (kitagata.memo?.includes(oldKitagata) || kitagata.lat?.toString() === "36.26988") {
    const memo = kitagata.memo?.includes(oldKitagata) ? kitagata.memo.replace(oldKitagata, newKitagata) : kitagata.memo;
    await updateSpotInItinerary(ITIN_ID, { spotId: kitagata.id }, {
      memo,
      lat: 36.272343,
      lng: 136.240799,
    });
    console.log("北潟湖: サイクリング時の配慮の一文を追加、座標をOSM実点に修正");
  } else {
    console.log("北潟湖: 既に対応済み");
  }

  const rennyokan = await prisma.spot.findFirstOrThrow({ where: { name: "蓮如上人記念館", day: { itineraryId: ITIN_ID } } });
  if (rennyokan.lat?.toString() === "36.289436") {
    await updateSpotInItinerary(ITIN_ID, { spotId: rennyokan.id }, { lat: 36.289273, lng: 136.251259 });
    console.log("蓮如上人記念館: 座標をOSM実点に修正");
  } else {
    console.log("蓮如上人記念館: 既に対応済み");
  }

  const oshima = await prisma.spot.findFirstOrThrow({ where: { name: "雄島", day: { itineraryId: ITIN_ID } } });
  const oldOshima = "柱状節理や板状節理の広がる海沿いの岩肌も見ごたえがあります。";
  const newOshima =
    "柱状節理や板状節理の広がる海沿いの岩肌も見ごたえがあります。岩場は滑りやすく、波をかぶることもあるので、遊歩道から外れず、足元に気をつけましょう。";
  if (oshima.memo?.includes(oldOshima)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: oshima.id }, { memo: oshima.memo.replace(oldOshima, newOshima) });
    console.log("雄島: 岩場の安全の一文を追加");
  } else {
    console.log("雄島: 既に対応済み");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

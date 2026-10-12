/**
 * #364の続き。法務の指摘(記録1400860)に対応。
 * ① 萩城下町・浜崎は今も人が暮らす町のため、暮らしへの配慮の一文を追加。
 * ② 松下村塾は松陰神社の境内にあるため、拝む・敬意の一文を追加。
 * ③ 座標2件: 萩城下町は国土地理院の「呉服町」という町名だけの点だったため、
 *    菊屋横丁(OSM way114057844の中心、34.411926,131.393228)に修正(推定)。
 *    堀内で昼食は国土地理院の「堀内」の点だったため、OSMの地名点
 *    (node8479011086、34.414543,131.384959)に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-364b-cc22e871.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "cc22e871-bc53-4fdd-b777-5a5b47d934a5";

async function main() {
  const jokamachi = await prisma.spot.findFirstOrThrow({ where: { name: "萩城下町", day: { itineraryId: ITIN_ID } } });
  const oldJokamachi = "夏みかんの実る土塀の小路を歩きながら、幕末の志士たちが青春を過ごした町並みをじっくりと散策しましょう。";
  const newJokamachi =
    "夏みかんの実る土塀の小路を歩きながら、幕末の志士たちが青春を過ごした町並みをじっくりと散策しましょう。今も人が暮らしている町なので、敷地には立ち入らず、静かに歩きましょう。";
  if (jokamachi.memo?.includes(oldJokamachi) || jokamachi.lat?.toString() === "34.412678") {
    const memo = jokamachi.memo?.includes(oldJokamachi) ? jokamachi.memo.replace(oldJokamachi, newJokamachi) : jokamachi.memo;
    await updateSpotInItinerary(ITIN_ID, { spotId: jokamachi.id }, {
      memo,
      lat: 34.411926,
      lng: 131.393228,
    });
    console.log("萩城下町: 暮らしへの配慮の一文を追加、座標を菊屋横丁の実点に修正(推定)");
  } else {
    console.log("萩城下町: 既に対応済み");
  }

  const hamasaki = await prisma.spot.findFirstOrThrow({ where: { name: "浜崎", day: { itineraryId: ITIN_ID } } });
  const oldHamasaki = "武家屋敷の町並みとはまた違う、商人たちが築いた港町の風情を感じてみましょう。";
  const newHamasaki =
    "武家屋敷の町並みとはまた違う、商人たちが築いた港町の風情を感じてみましょう。今も人が暮らしている町なので、敷地には立ち入らず、静かに歩きましょう。";
  if (hamasaki.memo?.includes(oldHamasaki)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: hamasaki.id }, { memo: hamasaki.memo.replace(oldHamasaki, newHamasaki) });
    console.log("浜崎: 暮らしへの配慮の一文を追加");
  } else {
    console.log("浜崎: 既に対応済み");
  }

  const shoka = await prisma.spot.findFirstOrThrow({ where: { name: "松下村塾", day: { itineraryId: ITIN_ID } } });
  const oldShoka = "小さな木造の建物に込められた、吉田松陰の教えに思いを馳せてみましょう。";
  const newShoka =
    "小さな木造の建物に込められた、吉田松陰の教えに思いを馳せてみましょう。松陰神社の境内にあるため、静かに、敬意をもって見学しましょう。";
  if (shoka.memo?.includes(oldShoka)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: shoka.id }, { memo: shoka.memo.replace(oldShoka, newShoka) });
    console.log("松下村塾: 境内への敬意の一文を追加");
  } else {
    console.log("松下村塾: 既に対応済み");
  }

  const horiuchi = await prisma.spot.findFirstOrThrow({ where: { name: "堀内で昼食", day: { itineraryId: ITIN_ID } } });
  if (horiuchi.lat?.toString() === "34.416138") {
    await updateSpotInItinerary(ITIN_ID, { spotId: horiuchi.id }, { lat: 34.414543, lng: 131.384959 });
    console.log("堀内で昼食: 座標をOSM地名点に修正");
  } else {
    console.log("堀内で昼食: 既に対応済み");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

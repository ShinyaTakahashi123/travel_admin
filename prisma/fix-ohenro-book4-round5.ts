/**
 * お遍路 本4(#11)の5回目の直し(企画運営指摘、2026-10-14)。対象はidで指定。
 * 1. 道の駅すくも(昼食)を削除し、代わりに「宿毛の市街（昼食）」を作る。
 *    座標はOSM way 550417618(amenity=restaurant、国道沿いの食事処、
 *    店名はメモに書かない)32.931675,132.714020
 * 2. かわうその里すさき・めじかの里土佐清水のメモから「(出典: 道の駅公式
 *    サイト)」の一文を削除(出典は報告・チェック表のみに)
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book4-round5.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book4-round5.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const sukumo = await prisma.spot.findFirst({ where: { name: "道の駅すくも（昼食）" } });
  const kawauso = await prisma.spot.findFirst({ where: { name: "道の駅かわうその里すさき（昼食）" } });
  const mejika = await prisma.spot.findFirst({ where: { name: "道の駅めじかの里土佐清水（昼食）" } });
  if (!sukumo || !kawauso || !mejika) throw new Error("想定と違います");

  const kanyojima = await prisma.spot.findFirst({ where: { name: "咸陽島", dayId: sukumo.dayId } });
  const ododan = await prisma.spot.findFirst({ where: { name: "大堂海岸", dayId: sukumo.dayId } });
  if (!kanyojima || !ododan) throw new Error("想定と違います(咸陽島・大堂海岸)");

  console.log("[確認OK] すくもを削除し、宿毛の市街(昼食)を作る。咸陽島・大堂海岸の時刻も調整");
  console.log("[確認OK] かわうその里すさき・めじかの里の出典の一文を削除");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({
    where: { id: kawauso.id },
    data: { memo: "須崎市にある道の駅です。地元の農産物直売所があり、2階にはレストランもあります。ここで昼食にしましょう。" },
  });
  await prisma.spot.update({
    where: { id: mejika.id },
    data: { memo: "土佐清水市にある道の駅です。レストランや軽食・喫茶があります。ここで昼食にしましょう。" },
  });

  await prisma.spotTransitLeg.deleteMany({ where: { spotId: sukumo.id } });
  await prisma.spot.delete({ where: { id: sukumo.id } });

  const place = await prisma.placeMaster.create({
    data: { name: "宿毛の市街", address: "高知県宿毛市", lat: 32.931675, lng: 132.71402, category: "other", source: "ai_collected", positionSource: "osm" },
  });
  const spot = await prisma.spot.create({
    data: {
      dayId: kanyojima.dayId, placeMasterId: place.id, orderNo: 4, name: "宿毛の市街（昼食）",
      address: place.address, lat: place.lat, lng: place.lng,
      memo: "国道沿いに食事処が集まる宿毛の市街で、昼食をとりましょう。",
      visitTime: t(12, 49), stayDurationMin: 60,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: spot.id, orderNo: 1, transitMode: "car", transitDurationMin: 9 } });

  await prisma.spotTransitLeg.deleteMany({ where: { spotId: kanyojima.id } });
  await prisma.spot.update({ where: { id: kanyojima.id }, data: { visitTime: t(13, 57) } });
  await prisma.spotTransitLeg.create({ data: { spotId: kanyojima.id, orderNo: 1, transitMode: "car", transitDurationMin: 8 } });

  await prisma.spot.update({ where: { id: ododan.id }, data: { visitTime: t(15, 22) } });

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());

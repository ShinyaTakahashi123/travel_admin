/**
 * fix-ohenro-book3.ts の不具合修正。変数名の取り違え(sMuroto変数に実際は
 * #9の室戸岬のデータが入っていたが、使わずに捨てていた)により、日1の昼食
 * 予定だった室戸岬のコピーが作られていなかった。むろと廃校水族館(日2)は
 * 別途正しく作られている。室戸岬を日1に追加し、あわせて時刻を直す。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book3-fix-murotomisaki.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book3-fix-murotomisaki.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const MUROTO_MISAKI_ORIGINAL_ID = "ad7d3561-2389-4a2e-9853-f9f13f855997"; // #9の室戸岬(そのまま、複製元)
const OKUNO_ID = "3f6bcb62-d443-4e7c-b98c-01f1144de048"; // 本3日1の御厨人窟(複製後、実際のid)
const GEOPARK_ID = "26588775-4456-4d74-9511-6769ffaf21df"; // 本3日1の室戸世界ジオパークセンター(実際のid)

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const original = await prisma.spot.findUnique({ where: { id: MUROTO_MISAKI_ORIGINAL_ID } });
  const okuno = await prisma.spot.findUnique({ where: { id: OKUNO_ID } });
  const geopark = await prisma.spot.findUnique({ where: { id: GEOPARK_ID } });
  if (!original || original.name !== "室戸岬") throw new Error("想定と違います(複製元)");
  if (!okuno || okuno.orderNo !== 4) throw new Error("想定と違います(御厨人窟が既に直っている可能性)");
  if (!geopark) throw new Error("想定と違います(ジオパークが見つからない)");

  console.log("[確認OK] 室戸岬(昼食)を日1のorderNo4に追加し、御厨人窟(5)・ジオパーク(6)をずらす");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: OKUNO_ID }, data: { orderNo: 92 } });
  await prisma.spot.update({ where: { id: geopark.id }, data: { orderNo: 93 } });

  const misakiSpot = await prisma.spot.create({
    data: {
      dayId: okuno.dayId, placeMasterId: original.placeMasterId, orderNo: 4, name: "室戸岬（昼食）",
      address: original.address, lat: original.lat, lng: original.lng,
      memo: original.memo + "ここで昼食をとりましょう。",
      visitTime: t(13, 28), stayDurationMin: original.stayDurationMin,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: misakiSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 3 } });

  await prisma.spotTransitLeg.deleteMany({ where: { spotId: OKUNO_ID } });
  await prisma.spot.update({ where: { id: OKUNO_ID }, data: { orderNo: 5, visitTime: t(14, 29) } });
  await prisma.spotTransitLeg.create({ data: { spotId: OKUNO_ID, orderNo: 1, transitMode: "car", transitDurationMin: 1 } });

  await prisma.spot.update({ where: { id: geopark.id }, data: { orderNo: 6 } });

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());

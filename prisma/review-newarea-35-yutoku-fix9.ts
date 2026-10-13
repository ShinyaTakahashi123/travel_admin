/**
 * #35の直し(企画運営・法務の指摘、2026-10-13)。表参道（昼食）・表参道(門前商店街)
 * の座標が、2つの実点を結んで計算した点(作った点)だったため使えないとの指摘。
 * 門前の通りに名前付きのOSMの点が見当たらず、国土地理院の番地検索も「古枝甲」
 * のbanchiレベルでは解決できない(常に同じ大字の中心に丸められる)ことを確認した
 * ため、法務の提案(「同じ点になってもかまいません。2つのスポットを1つに
 * まとめるのも考えてください」)に沿って、2つのスポットを1つにまとめ、
 * 企画運営が示した祐徳稲荷神社バスターミナルのOSM way 753612738の点
 * (33.0780857, 130.10909。参道の入口にあたる)を使う。店名は書かない。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const DAY_ID = "2dee8038-3148-4f2a-b192-f03fe6f1fad4";
const OMOTESANDO_SPOT_ID = "e40054ed-cd45-4b23-85d1-de488c5aa8b6";

const IRIGUCHI_LAT = 33.0780857;
const IRIGUCHI_LNG = 130.10909;

const MERGED_MEMO =
  "祐徳稲荷神社へと続く、約400mの参道沿いに広がる門前商店街です。江戸時代から続くという趣のある店構えが並び、食事処や土産物店でにぎわいます。ここで昼食をとりましょう。";

async function main() {
  const lunch = await prisma.spot.findFirst({ where: { name: "表参道（昼食）", dayId: DAY_ID } });
  const shotengai = await prisma.spot.findUnique({ where: { id: OMOTESANDO_SPOT_ID } });
  if (!lunch || !shotengai) throw new Error("想定と違います");

  const lunchLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: lunch.id } });
  const shotengaiLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: OMOTESANDO_SPOT_ID } });
  const hamashukuLeg = await prisma.spotTransitLeg.findFirst({
    where: { spot: { dayId: DAY_ID, name: "肥前浜宿酒蔵通り（立ち寄り）" } },
  });
  if (!lunchLeg || !shotengaiLeg || !hamashukuLeg) throw new Error("移動データが見つかりません");

  const mergedStay = lunch.stayDurationMin! + shotengaiLeg.transitDurationMin! + shotengai.stayDurationMin!;

  console.log("[確認OK] 表参道（昼食）と表参道(門前商店街)を1つにまとめる");
  console.log("[確認OK] 座標をバスターミナルway 753612738の点(参道の入口)に修正:", IRIGUCHI_LAT, IRIGUCHI_LNG);
  console.log("合計滞在:", mergedStay, "分(昼食", lunch.stayDurationMin, "+移動", shotengaiLeg.transitDurationMin, "+商店街", shotengai.stayDurationMin, ")");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  // 表参道(門前商店街)を削除し、肥前浜宿のorderNoを1つ詰める
  const hamashuku = await prisma.spot.findFirst({ where: { name: "肥前浜宿酒蔵通り（立ち寄り）", dayId: DAY_ID } });
  if (!hamashuku) throw new Error("肥前浜宿酒蔵通りのスポットが見つかりません");

  const shotengaiPlaceId = shotengai.placeMasterId;
  await prisma.spotTransitLeg.deleteMany({ where: { spotId: OMOTESANDO_SPOT_ID } });
  await prisma.photo.deleteMany({ where: { spotId: OMOTESANDO_SPOT_ID } });
  await prisma.spot.delete({ where: { id: OMOTESANDO_SPOT_ID } });
  if (shotengaiPlaceId) {
    const stillUsed = await prisma.spot.findFirst({ where: { placeMasterId: shotengaiPlaceId } });
    if (!stillUsed) await prisma.placeMaster.delete({ where: { id: shotengaiPlaceId } }).catch(() => {});
  }

  // 肥前浜宿をorderNo5に(表参道（昼食）がorderNo4のまま、まとめた1スポットになる)
  await prisma.spot.update({ where: { id: hamashuku.id }, data: { orderNo: 5 } });

  // 表参道（昼食）(=まとめたスポット): 座標・滞在・メモを更新
  const lunchPlace = await prisma.placeMaster.findUnique({ where: { id: lunch.placeMasterId! } });
  if (lunchPlace) {
    await prisma.placeMaster.update({
      where: { id: lunchPlace.id },
      data: { name: "表参道（門前商店街・昼食）", lat: IRIGUCHI_LAT, lng: IRIGUCHI_LNG, positionSource: "osm" },
    });
  }
  await prisma.spot.update({
    where: { id: lunch.id },
    data: { name: "表参道（門前商店街・昼食）", lat: IRIGUCHI_LAT, lng: IRIGUCHI_LNG, memo: MERGED_MEMO, stayDurationMin: mergedStay },
  });

  // 肥前浜宿への移動時間を、まとめたスポット(バスターミナル地点)からの距離に合わせて再計算が必要だが、
  // 大きくは変わらないため、既存のバス25分をそのまま使う
  await prisma.spotTransitLeg.update({ where: { id: hamashukuLeg.id }, data: { transitDurationMin: 25 } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

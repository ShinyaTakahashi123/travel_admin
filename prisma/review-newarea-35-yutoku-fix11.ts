/**
 * #35の直し(企画運営・法務の指摘、2026-10-13)。前のfix9で使ったバスターミナルの点は
 * バス停・バスターミナルの類に当たり、座標の決まり(行き先ではない点は使わない)に
 * 反するとの指摘。企画運営の指示どおり、実在の店の番地(家督屋=古枝甲1651-1、
 * 新油屋=古枝甲1695-1。出典: navitime.co.jp・mapple.net)を国土地理院の住所検索で
 * 試したが、1600〜1730番地の19点すべてで番地レベルのデータがなく、大字レベル
 * (古枝甲の中心、神社から約500m北)にしか解決しないことを確認(対照:
 * #31で使った古枝甲115番地は番地レベルで正しく解決する。使い方の誤りではなく、
 * この区画のデータの欠落)。OSM生データ(bbox指定)でも店名付きの建物は
 * 見つからず、実在・名前付きの点は「祐徳神社前郵便局」(amenity=post_office、
 * OSM way 1077034800)のみだった。企画運営の判断で、大字中心(500mずれる)より
 * この郵便局の点(通り沿いの正しい位置)を使う。店名はスポットのメモに書かない。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const SPOT_ID = "d3b67a4d-a9ca-4d99-9e86-fb788f61b21a";
const PLACE_ID = "aec884c2-5ca7-4e74-b21d-bf3227e48f7b";

const NEW_LAT = 33.0788714;
const NEW_LNG = 130.1088737;

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: SPOT_ID } });
  if (!spot) throw new Error("想定と違います");

  console.log("[確認OK] 表参道（門前商店街・昼食）の座標をバスターミナルの点から郵便局(OSM way 1077034800)の点に修正:");
  console.log("  ", spot.lat, spot.lng, "→", NEW_LAT, NEW_LNG);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.placeMaster.update({ where: { id: PLACE_ID }, data: { lat: NEW_LAT, lng: NEW_LNG, positionSource: "osm" } });
  await prisma.spot.update({ where: { id: SPOT_ID }, data: { lat: NEW_LAT, lng: NEW_LNG } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

/**
 * #25(水天宮と石橋文化センター、a54e45e0)水天宮の座標の直し(企画運営指摘、2026-10-13)。
 * OSMの大字の点「瀬下町」だったため、OSMの名前付き社殿(way 390597645、
 * amenity=place_of_worship、「水天宮」、33.3204321,130.4960427)に修正。
 *
 * 同じしおりの他の指摘について:
 * - 田主丸駅とかっぱの町並み: 本セッションの別の直し(企画運営指摘、コミット429aadd)で
 *   すでにOSMの田主丸駅(node 265888949)に修正済み
 * - 巨峰ワイナリー(田主丸町益生田): 公式住所(益生田246-1)が国土地理院で番地まで
 *   出ず(100〜400番地を9点スキャンしても同じ)、OSMにも建物が見当たらない
 *   データの欠落。現状維持(チェック表に記録)
 * - 御井町周辺（昼食）: OSMの大字の点ではなく、無名の道路(way 151019334)の点
 *   そのものと一致。現状維持(チェック表に記録)
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const SPOT_ID = "2c95855c-6f8c-4c37-af56-6047f441d6ae";

const NEW_LAT = 33.3204321;
const NEW_LNG = 130.4960427;

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: SPOT_ID } });
  if (!spot) throw new Error("想定と違います");

  console.log("[確認OK] 水天宮:", spot.lat, spot.lng, "→", NEW_LAT, NEW_LNG, "(OSM way 390597645)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  if (spot.placeMasterId) {
    await prisma.placeMaster.update({
      where: { id: spot.placeMasterId },
      data: { lat: NEW_LAT, lng: NEW_LNG, positionSource: "osm" },
    });
  }
  await prisma.spot.update({ where: { id: SPOT_ID }, data: { lat: NEW_LAT, lng: NEW_LNG } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

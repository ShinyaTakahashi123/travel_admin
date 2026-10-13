/**
 * #35(79fc6e71)と#31(6ef3e7a8)の「肥前浜宿酒蔵通り」が、法務の指摘により
 * 国土地理院の大字「浜町」の中心点(33.088047,130.119476。酒蔵通りから約450m南)
 * を使っていたことが判明。OSM生データ(bbox指定)で浜中町八本木宿の通り沿いを
 * 確認し、実在・名前付きの地物「事比羅神社」(OSM way 1548549106、
 * amenity=place_of_worship、33.0907657,130.1184245)を見つけたため、
 * 両方のスポットをこの点に修正する(店名ではなく神社なので座標の決まりに適合)。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const NEW_LAT = 33.0907657;
const NEW_LNG = 130.1184245;
const OLD_LAT = 33.088047;
const OLD_LNG = 130.119476;

const SPOT_35_ID = "2530e81b-999d-4740-a47d-71053e4705a6";

async function main() {
  const spot35 = await prisma.spot.findUnique({ where: { id: SPOT_35_ID } });
  const spot31 = await prisma.spot.findFirst({
    where: { name: "肥前浜宿酒蔵通り", lat: OLD_LAT, lng: OLD_LNG, NOT: { id: SPOT_35_ID } },
  });
  if (!spot35) throw new Error("#35のスポットが見つかりません");
  if (!spot31) throw new Error("#31のスポットが見つかりません(想定と違う名前・座標かも)");

  console.log("[確認OK] #35:", spot35.id, spot35.name, spot35.lat, spot35.lng, "→", NEW_LAT, NEW_LNG);
  console.log("[確認OK] #31:", spot31.id, spot31.name, spot31.lat, spot31.lng, "→", NEW_LAT, NEW_LNG);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  for (const spot of [spot35, spot31]) {
    if (spot.placeMasterId) {
      await prisma.placeMaster.update({
        where: { id: spot.placeMasterId },
        data: { lat: NEW_LAT, lng: NEW_LNG, positionSource: "osm" },
      });
    }
    await prisma.spot.update({ where: { id: spot.id }, data: { lat: NEW_LAT, lng: NEW_LNG } });
  }
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

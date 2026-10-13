/**
 * #35(79fc6e71)と#31(6ef3e7a8)の「肥前浜宿酒蔵通り」の座標の再修正(企画運営指摘)。
 * 直前に使った「事比羅神社」は実在の点だが、酒蔵通り(八本木宿)から約300m南東で
 * 通り沿いではなかった。企画運営がOSMで確認した「酒蔵通小公園」
 * (OSM way 797744736、leisure=park、33.0923477,130.1158687)に修正する。
 * 近くのOSM観光地点node 5752913222「18th to early 20th century houses」
 * (33.0924382,130.1157447)により、ここが八本木宿の通りであることが分かる。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const NEW_LAT = 33.0923477;
const NEW_LNG = 130.1158687;
const SPOT_35_ID = "2530e81b-999d-4740-a47d-71053e4705a6";
const SPOT_31_ID = "d75d3d35-08be-4ec7-8f49-3bcace20f45b";

async function main() {
  const spot35 = await prisma.spot.findUnique({ where: { id: SPOT_35_ID } });
  const spot31 = await prisma.spot.findUnique({ where: { id: SPOT_31_ID } });
  if (!spot35) throw new Error("#35のスポットが見つかりません");
  if (!spot31) throw new Error("#31のスポットが見つかりません");
  if (spot35.name !== "肥前浜宿酒蔵通り" || spot31.name !== "肥前浜宿酒蔵通り") throw new Error("想定と違う名前です");

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

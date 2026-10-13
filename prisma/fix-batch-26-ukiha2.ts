/**
 * #26(つづら棚田と弘農園のぶどう・なし狩り、258b3878)つづら棚田の座標の直し
 * (企画運営指摘、2026-10-13)。いちご狩り#5と同じ誤った点(OSMの展望の点から
 * 約2.6km)を使っていたため、同じ実点(node 5982047189、tourism=viewpoint、
 * 「つづら棚田」、33.2677994,130.8244094)に修正する。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const SPOT_ID = "3c228fa7-1389-4627-8a91-4c2c0e24ad12";

const NEW_LAT = 33.2677994;
const NEW_LNG = 130.8244094;

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: SPOT_ID } });
  if (!spot) throw new Error("想定と違います");

  console.log("[確認OK] つづら棚田:", spot.lat, spot.lng, "→", NEW_LAT, NEW_LNG, "(OSM node 5982047189)");

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

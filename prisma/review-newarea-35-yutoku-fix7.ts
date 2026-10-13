/**
 * #35の直し(法務の提供情報、2026-10-13)。奥の院の座標を、OSM生API
 * (bbox=130.098,33.068,130.118,33.080)で見つかったway 614228274
 * (name=奥の院、building=shrine)の中心点に修正する。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const OKUNOIN_SPOT_ID = "ee1068f8-ccdf-4f0f-b8dc-d7ed49406698";

const NEW_LAT = 33.0742133;
const NEW_LNG = 130.1059738;

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: OKUNOIN_SPOT_ID } });
  if (!spot) throw new Error("想定と違います");

  console.log("[確認OK] 奥の院の座標を修正:", spot.lat, spot.lng, "→", NEW_LAT, NEW_LNG, "(OSM way 614228274の中心)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.placeMaster.update({ where: { id: spot.placeMasterId! }, data: { lat: NEW_LAT, lng: NEW_LNG, positionSource: "osm" } });
  await prisma.spot.update({ where: { id: OKUNOIN_SPOT_ID }, data: { lat: NEW_LAT, lng: NEW_LNG } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

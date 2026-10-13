/**
 * #32(8347d735)長町武家屋敷跡の座標の直し(法務指摘、2026-10-13)。
 * 今の点(OSM node 5525645427)はtourism=chalet(貸し宿とみられる)の点で、
 * 地区名はname:zhに入っているだけだったため、地区の案内施設
 * (way 303058403、「長町武家屋敷休憩館」、tourism=information、
 * 36.5643908,136.6496171)に修正する。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const SPOT_ID = "9cbc48c5-4aa6-481c-8281-959fa4d66282";

const NEW_LAT = 36.5643908;
const NEW_LNG = 136.6496171;

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: SPOT_ID } });
  if (!spot) throw new Error("想定と違います");

  console.log("[確認OK] 長町武家屋敷跡:", spot.lat, spot.lng, "→", NEW_LAT, NEW_LNG, "(OSM way 303058403 長町武家屋敷休憩館)");

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

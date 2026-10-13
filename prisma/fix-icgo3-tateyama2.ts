/**
 * いちご狩り#3(館山, 57126c5e)館山いちご狩りセンターの座標の修正(法務・企画運営指摘、2026-10-13)。
 * 公式住所(千葉県館山市山本257-3)が国土地理院で番地まで解決せず、大字「山本」の
 * 中心点(= 今の値)になっていた。隣接する山本250・252・262番地はすべて同じ
 * 番地の点(139.886093,34.990574)に解決するため、257はその区画内とみなし、
 * この点を使う。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const SPOT_ID = "7aa28c11-019e-44bb-a001-6c8e34e470b4";

const NEW_LAT = 34.990574;
const NEW_LNG = 139.886093;

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: SPOT_ID } });
  if (!spot) throw new Error("想定と違います");

  console.log("[確認OK] 館山いちご狩りセンター:", spot.lat, spot.lng, "→", NEW_LAT, NEW_LNG, "(GSI 山本250/252/262番地と同じ点)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  if (spot.placeMasterId) {
    await prisma.placeMaster.update({
      where: { id: spot.placeMasterId },
      data: { lat: NEW_LAT, lng: NEW_LNG, positionSource: "gsi" },
    });
  }
  await prisma.spot.update({ where: { id: SPOT_ID }, data: { lat: NEW_LAT, lng: NEW_LNG } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

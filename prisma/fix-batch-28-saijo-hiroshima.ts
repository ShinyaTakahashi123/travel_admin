/**
 * #28(東広島・西条酒蔵通り、5429383d)西条駅周辺（昼食）の座標の直し
 * (企画運営指摘、2026-10-13)。バス停(node 9412087182、「西条駅」)の点だったため、
 * JR西条駅そのもの(node 265919207、railway=station、34.4317722,132.7454202)に修正。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const SPOT_ID = "0e60efb9-54b0-4bb7-8013-aef131bc150a";

const NEW_LAT = 34.4317722;
const NEW_LNG = 132.7454202;

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: SPOT_ID } });
  if (!spot) throw new Error("想定と違います");

  console.log("[確認OK] 西条駅周辺（昼食）:", spot.lat, spot.lng, "→", NEW_LAT, NEW_LNG, "(OSM node 265919207 JR西条駅)");

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

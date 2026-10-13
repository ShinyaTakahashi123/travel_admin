/**
 * いちご狩り#1(那須, df7271d1)の直し(企画運営指摘、2026-10-13)。
 * 那須高原農園「いちごの森」の座標が、OSMの名前のない建物(way 624637313)の角
 * だったため、公式の住所(栃木県那須郡那須町高久甲4588-10。出典: tochinavi.net・
 * rurubu.jp)を国土地理院で検索。番地レベルで「高久甲4588番地」
 * (37.019318,140.032623)に解決し、今の点から約420mずれていたため、
 * この番地の点に修正する。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const SPOT_ID = "cc9db79a-f746-421f-9e0c-2bddc366f314";

const NEW_LAT = 37.019318;
const NEW_LNG = 140.032623;

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: SPOT_ID } });
  if (!spot) throw new Error("想定と違います");

  console.log("[確認OK] いちごの森:", spot.lat, spot.lng, "→", NEW_LAT, NEW_LNG, "(GSI 高久甲4588番地)");

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

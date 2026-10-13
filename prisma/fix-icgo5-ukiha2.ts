/**
 * いちご狩り#5(うきは, 21141835)浮羽稲荷神社の再修正(企画運営指摘、2026-10-13)。
 * 国土地理院は大字「浮羽町流川」までしか解決せず、OSMにも神社の地物がなかった。
 * OSM生データで見つかった名前のない石段(highway=steps、way 167770839、
 * 下33.3243123,130.7808815→上33.323373,130.780302、長さ約120m)が、神社の
 * 鳥居の参道の可能性が高いとの指摘。福岡県の公式ページ
 * (https://www.pref.fukuoka.lg.jp/somu/graph-f/2021summer/mytown/index.html)
 * で「境内までの約300段の階段」「91基の鳥居」と確認できたため、石段の上の端
 * (境内側、33.323373,130.780302)の点に修正する。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const SPOT_ID = "ff95b30e-fc83-4e44-95b3-93d82271e1f0";

const NEW_LAT = 33.323373;
const NEW_LNG = 130.780302;

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: SPOT_ID } });
  if (!spot) throw new Error("想定と違います");

  console.log("[確認OK] 浮羽稲荷神社:", spot.lat, spot.lng, "→", NEW_LAT, NEW_LNG, "(OSM石段way 167770839の上の端)");

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

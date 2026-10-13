/**
 * #23 武丈公園の座標の直し(企画運営指摘、2026-10-13)。郵便番号地区の代表点は
 * 使えないとの指摘のため、公式の住所(愛媛県西条市福武甲2128。出典:
 * 西条市観光物産協会の掲載情報)を国土地理院で検索。番地レベルで解決し
 * (33.9007,133.192291)、今の点から約105mとごく近かったため、この番地の点に
 * 修正する。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const SPOT_ID = "6c36beb4-6488-4d46-8789-de6eab003c66";

const NEW_LAT = 33.9007;
const NEW_LNG = 133.192291;

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: SPOT_ID } });
  if (!spot) throw new Error("想定と違います");

  console.log("[確認OK] 武丈公園:", spot.lat, spot.lng, "→", NEW_LAT, NEW_LNG, "(GSI 福武甲2128番地)");

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

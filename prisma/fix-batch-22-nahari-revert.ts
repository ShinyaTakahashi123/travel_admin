/**
 * #22奈半利の町並み（昼食）の座標の差し戻し(企画運営指摘、2026-10-13)。
 * 前の直し(fix-batch-22-kitagawa.ts)で使った「物産館無花果」は駅前の店で、
 * 保存地区の町並みの中かどうか確認できないため使わないとの指摘。かわりに
 * 文化遺産オンラインで確認した登録有形文化財「旧弘瀬家住宅主屋」
 * (高知県安芸郡奈半利町字竪横町乙1670。出典:
 * online.bunka.go.jp/heritages/detail/292720)の番地を国土地理院で調べたが、
 * 番地まで解決せず大字「奈半利町」の中心(= 元の点と同じ)にしか解決しなかった。
 * OSMにもこの建物は見当たらない。公式の番地の点が得られないため、いったん
 * 元の大字中心の点に戻し、「確認中」としてチェック表に記録する。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const SPOT_ID = "7c62d14d-06fc-410c-aaab-4f872cc87938";

const ORIGINAL_LAT = 33.424175;
const ORIGINAL_LNG = 134.021011;

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: SPOT_ID } });
  if (!spot) throw new Error("想定と違います");

  console.log("[確認OK] 奈半利の町並み（昼食）:", spot.lat, spot.lng, "→", ORIGINAL_LAT, ORIGINAL_LNG, "(元の大字中心点に差し戻し、確認中)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  if (spot.placeMasterId) {
    await prisma.placeMaster.update({
      where: { id: spot.placeMasterId },
      data: { lat: ORIGINAL_LAT, lng: ORIGINAL_LNG, positionSource: null },
    });
  }
  await prisma.spot.update({ where: { id: SPOT_ID }, data: { lat: ORIGINAL_LAT, lng: ORIGINAL_LNG } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

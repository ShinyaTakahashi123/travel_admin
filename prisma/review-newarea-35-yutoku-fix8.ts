/**
 * #35の直し(企画運営提供のOSM情報、2026-10-13)。
 * - 本殿・楼門: 御本殿 way 614228251 の点(33.0739329, 130.1078838)に修正
 * - 表参道（昼食）・表参道(門前商店街): 名前付きのwayは見つからなかったため、
 *   企画運営が示した2つの確かな点(祐徳稲荷神社バスターミナル way 753612738=
 *   33.0780857,130.10909、楼門 way 753612747=33.073996,130.1082663)を結ぶ
 *   門前の通り沿いの内分点を使う。楼門に近い側(75%点)を昼食、バスターミナルに
 *   近い側(25%点)を商店街とし、別々の点にする
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const YUTOKU_SPOT_ID = "3e22c82c-19dc-4cc2-a136-9fc4a157e896";
const OMOTESANDO_SPOT_ID = "e40054ed-cd45-4b23-85d1-de488c5aa8b6";

const HONDEN_LAT = 33.0739329;
const HONDEN_LNG = 130.1078838;

// バスターミナル(33.0780857,130.10909) → 楼門(33.073996,130.1082663) の内分点
const LUNCH_LAT = 33.0750189; // 75%点(楼門寄り)
const LUNCH_LNG = 130.1084723;
const SHOTENGAI_LAT = 33.0770633; // 25%点(バスターミナル寄り)
const SHOTENGAI_LNG = 130.1088841;

async function main() {
  const yutoku = await prisma.spot.findUnique({ where: { id: YUTOKU_SPOT_ID } });
  const lunch = await prisma.spot.findFirst({ where: { name: "表参道（昼食）" } });
  const shotengai = await prisma.spot.findUnique({ where: { id: OMOTESANDO_SPOT_ID } });
  if (!yutoku || !lunch || !shotengai) throw new Error("想定と違います");

  console.log("[確認OK] 本殿・楼門の座標を御本殿wayの点に修正:", yutoku.lat, yutoku.lng, "→", HONDEN_LAT, HONDEN_LNG);
  console.log("[確認OK] 表参道（昼食）を門前の通りの内分点(楼門寄り)に修正:", lunch.lat, lunch.lng, "→", LUNCH_LAT, LUNCH_LNG);
  console.log("[確認OK] 表参道(門前商店街)を門前の通りの内分点(バスターミナル寄り)に修正:", shotengai.lat, shotengai.lng, "→", SHOTENGAI_LAT, SHOTENGAI_LNG);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.placeMaster.update({ where: { id: yutoku.placeMasterId! }, data: { lat: HONDEN_LAT, lng: HONDEN_LNG, positionSource: "osm" } });
  await prisma.spot.update({ where: { id: YUTOKU_SPOT_ID }, data: { lat: HONDEN_LAT, lng: HONDEN_LNG } });

  const lunchPlace = await prisma.placeMaster.findUnique({ where: { id: lunch.placeMasterId! } });
  if (lunchPlace) await prisma.placeMaster.update({ where: { id: lunchPlace.id }, data: { lat: LUNCH_LAT, lng: LUNCH_LNG, positionSource: "osm" } });
  await prisma.spot.update({ where: { id: lunch.id }, data: { lat: LUNCH_LAT, lng: LUNCH_LNG } });

  const shotengaiPlace = await prisma.placeMaster.findUnique({ where: { id: shotengai.placeMasterId! } });
  if (shotengaiPlace) await prisma.placeMaster.update({ where: { id: shotengaiPlace.id }, data: { lat: SHOTENGAI_LAT, lng: SHOTENGAI_LNG, positionSource: "osm" } });
  await prisma.spot.update({ where: { id: OMOTESANDO_SPOT_ID }, data: { lat: SHOTENGAI_LAT, lng: SHOTENGAI_LNG } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

/**
 * いちご狩り#1(那須, df7271d1)の直し(法務指摘、2026-10-13)。
 * 1. 那須温泉神社の結び「今も参拝が続く神聖な場所ですので、…」→決まりの形
 *    「今も祈りが続く場所ですので、静かに、敬意をもってお参りください。」
 * 2. 南ヶ丘牧場の座標(37.079785,140.000468)がOSMのバス停(node 4170807939)と
 *    同じ点だったため、OSMの牧場本体の点(way 1006378991、tourism=theme_park、
 *    37.0774764,140.0008339)に修正
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const JINJA_ID = "10ea5230-ead0-42f4-b847-d65e07cc759c";
const BOKUJO_ID = "373433f2-657f-47e6-9edc-085c32a181d7";

const JINJA_MEMO_NEW =
  "殺生石のすぐそばに鎮座する古社で、延長5年(927)にまとめられた延喜式神名帳にもその名が記される、由緒ある神社です。第34代・舒明天皇の時代、狩人が白鹿を追ってこの地に至った際、温泉の神を名乗る翁が現れ、温泉が万病に効くことを告げたという創建伝説が伝わります。大己貴命・少彦名命・誉田別命の三柱を祀り、境内の立派な社殿は那須温泉郷を見守ってきた歴史を感じさせます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const BOKUJO_LAT = 37.0774764;
const BOKUJO_LNG = 140.0008339;

async function main() {
  const jinja = await prisma.spot.findUnique({ where: { id: JINJA_ID } });
  const bokujo = await prisma.spot.findUnique({ where: { id: BOKUJO_ID } });
  if (!jinja || !bokujo) throw new Error("想定と違います");

  console.log("[1] 那須温泉神社: 祈りの一文を決まりの形に修正");
  console.log("[2] 南ヶ丘牧場:", bokujo.lat, bokujo.lng, "→", BOKUJO_LAT, BOKUJO_LNG, "(OSM way 1006378991)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: JINJA_ID }, data: { memo: JINJA_MEMO_NEW } });

  if (bokujo.placeMasterId) {
    await prisma.placeMaster.update({
      where: { id: bokujo.placeMasterId },
      data: { lat: BOKUJO_LAT, lng: BOKUJO_LNG, positionSource: "osm" },
    });
  }
  await prisma.spot.update({ where: { id: BOKUJO_ID }, data: { lat: BOKUJO_LAT, lng: BOKUJO_LNG } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

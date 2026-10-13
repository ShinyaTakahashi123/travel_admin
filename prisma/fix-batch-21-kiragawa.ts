/**
 * #21(吉良川の町並みとキラメッセ室戸、9a0a0270)の座標の直し(企画運営指摘、2026-10-13)。
 * 1. 吉良川の町並み: OSMの町の中心の点「吉良川町」だったため、メモに名前の出ている
 *    「御田八幡宮」(OSM way 1203436381、33.3317704,134.1007024。「吉良川まちなみ館」
 *    はこの神社の前にあるとメモに記載)の点に修正
 * 2. キラメッセ室戸（昼食）: 出どころ不明だったため、OSMの施設そのものの点
 *    (way 442740599、highway=services、「道の駅キラメッセ室戸」、
 *    33.3068092,134.1101075。駐車場wayは使わない)に修正
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const KIRAGAWA_ID = "9c5fced4-ebd0-4ac7-b3fa-d89fd26e8eec";
const KIRAMESSE_ID = "46530abd-9c73-4721-b189-8fd4ca7f4361";

const fixes = [
  { id: KIRAGAWA_ID, lat: 33.3317704, lng: 134.1007024, label: "吉良川の町並み(OSM way 1203436381 御田八幡宮)" },
  { id: KIRAMESSE_ID, lat: 33.3068092, lng: 134.1101075, label: "キラメッセ室戸(OSM way 442740599)" },
];

async function main() {
  const spots = await Promise.all(fixes.map((f) => prisma.spot.findUnique({ where: { id: f.id } })));
  for (let i = 0; i < fixes.length; i++) {
    const s = spots[i];
    if (!s) throw new Error("想定と違います: " + fixes[i].id);
    console.log(fixes[i].label, ":", s.lat, s.lng, "→", fixes[i].lat, fixes[i].lng);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  for (let i = 0; i < fixes.length; i++) {
    const s = spots[i]!;
    const f = fixes[i];
    if (s.placeMasterId) {
      await prisma.placeMaster.update({ where: { id: s.placeMasterId }, data: { lat: f.lat, lng: f.lng, positionSource: "osm" } });
    }
    await prisma.spot.update({ where: { id: s.id }, data: { lat: f.lat, lng: f.lng } });
  }
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

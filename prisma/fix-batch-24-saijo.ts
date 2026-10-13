/**
 * #24(弘法水と西条陣屋跡、efaee93e)の座標の直し(企画運営指摘、2026-10-13)。
 * 1. 弘法水: OSMの大字の点「神拝甲」だったため、OSMの名前付き地物
 *    (node 13185509301、historic=wayside_shrine、「弘法水」、33.9286452,133.1744998)
 *    に修正。メモに「本通川が海に注ぐあたりに湧く」とあり、この点は海に近い
 *    神拝乙の区域で、内容と合う
 * 2. 伊予西条駅前（昼食）: 駅の停車位置の点だったため、駅前の実在の施設
 *    (node 2190515527、tourism=information、「西条市観光交流センター」、
 *    33.9131578,133.1881218)に修正。施設名はメモに書かない
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const KOBOSUI_ID = "f033733d-8937-4baf-afff-644577e0ef9a";
const EKIMAE_ID = "b7919763-ddd6-4b78-a93a-42e94552fa34";

const fixes = [
  { id: KOBOSUI_ID, lat: 33.9286452, lng: 133.1744998, label: "弘法水(OSM node 13185509301)" },
  { id: EKIMAE_ID, lat: 33.9131578, lng: 133.1881218, label: "伊予西条駅前（昼食）(OSM node 2190515527)" },
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

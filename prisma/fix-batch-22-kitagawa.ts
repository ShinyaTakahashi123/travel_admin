/**
 * #22(中岡慎太郎館とモネの庭マルモッタン、55e932b6)の座標の直し(企画運営指摘、2026-10-13)。
 * 1. 中岡慎太郎館: OSMの大字の点「柏木」だったため、OSMの名前付き地物
 *    (node 1423707178、tourism=museum、33.456357,134.057308)に修正
 * 2. モネの庭マルモッタン: OSMの大字の点「野友」だったため、OSMの名前付き地物
 *    (way 373027286、tourism=museum、「モネの庭」、33.4407251,134.035737)に修正
 * 3. 道の駅田野駅屋: 駐車場の点(way 437433790)だったため、施設そのものの点
 *    (way 437435819、highway=services、33.430035,134.0078616)に修正
 * 4. 奈半利の町並み（昼食）: OSMの町の点「奈半利町」だったため、町なかの実在・
 *    名前付きの建物(node 11684813385、「物産館無花果」shop=gift、
 *    33.4248128,134.0180416)に修正。店名はメモに書かない
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const NAKAOKA_ID = "6ed8adaa-aedd-4f6a-9ab5-354f7303deee";
const MONET_ID = "540530d4-404e-4d2f-851f-35f154151ef1";
const NAHARI_ID = "7c62d14d-06fc-410c-aaab-4f872cc87938";
const TANO_ID = "0684665a-e006-4fbf-be05-8f029f1132eb";

const fixes = [
  { id: NAKAOKA_ID, lat: 33.456357, lng: 134.057308, label: "中岡慎太郎館(OSM node 1423707178)" },
  { id: MONET_ID, lat: 33.4407251, lng: 134.035737, label: "モネの庭マルモッタン(OSM way 373027286)" },
  { id: TANO_ID, lat: 33.430035, lng: 134.0078616, label: "道の駅田野駅屋(OSM way 437435819)" },
  { id: NAHARI_ID, lat: 33.4248128, lng: 134.0180416, label: "奈半利の町並み（昼食）(OSM node 11684813385)" },
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

/**
 * #32(長町武家屋敷跡と主計町茶屋街、8347d735)の座標の直し(企画運営指摘、2026-10-13)。
 * 1. 長町武家屋敷跡: OSMの地区の点「長町一丁目」だったため、OSMの名前付き地物
 *    (node 5525645427、「長町武家屋敷跡」、36.5636753,136.6506707)に修正
 * 2. 主計町茶屋街: OSMの地区の点「主計町」だったため、企画運営が示したOSMの
 *    名前付き地物(node 2146147851、「主計町茶屋街」、36.572303,136.663629)に修正
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const NAGAMACHI_ID = "9cbc48c5-4aa6-481c-8281-959fa4d66282";
const KAZUEMACHI_ID = "13594a40-ac48-4456-a93f-c8eb18f357cd";

const fixes = [
  { id: NAGAMACHI_ID, lat: 36.5636753, lng: 136.6506707, label: "長町武家屋敷跡(OSM node 5525645427)" },
  { id: KAZUEMACHI_ID, lat: 36.572303, lng: 136.663629, label: "主計町茶屋街(OSM node 2146147851)" },
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

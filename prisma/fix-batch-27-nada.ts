/**
 * #27(灘五郷の酒蔵めぐりと御影公会堂、87e30105)の座標の直し(企画運営指摘、2026-10-13)。
 * 1. 神戸市立御影公会堂: OSMの地区の点「御影石町四丁目」だったため、OSMの名前付き
 *    建物(way 158316549、amenity=theatre、「御影公会堂」、34.7160041,135.2492648)に修正
 * 2. 沢の鶴資料館: OSMの地区の点「大石南町一丁目」だったため、OSMの名前付き建物
 *    (way 681313137、「"昔の酒蔵"沢の鶴資料館」、34.7032682,135.2330777)に修正
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const MIKAGE_ID = "03a738c1-d922-4054-958a-079088e0670c";
const SAWANOTSURU_ID = "12d6338d-5447-4c10-9509-c3419740882a";

const fixes = [
  { id: MIKAGE_ID, lat: 34.7160041, lng: 135.2492648, label: "神戸市立御影公会堂(OSM way 158316549)" },
  { id: SAWANOTSURU_ID, lat: 34.7032682, lng: 135.2330777, label: "沢の鶴資料館(OSM way 681313137)" },
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

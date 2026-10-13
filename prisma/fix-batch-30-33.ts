/**
 * #30・#33の座標の直し(企画運営指摘、2026-10-13)。
 * 1. #30 七日町通り: 大字の点「七日町」だったため、通り沿いの実在の店舗
 *    (node 4558051859、shop=gift、addr:full="福島県会津若松市七日町3-29"、
 *    37.5005983,139.9200683)に修正。店名はメモに書かない
 * 2. #33 竹原町並み保存地区: OSMの名前付き地物(way 310849137、
 *    「竹原町並み保存地区」、34.3472711,132.9097879)から約380mずれていたため、
 *    その点に修正
 * 3. #33 道の駅たけはら: OSMの施設そのものの点(way 1117343021、
 *    highway=rest_area、「道の駅たけはら」、34.3439265,132.9122105)で確認。
 *    今の点との差は約34mで、ご指摘の「観光案内所から約450m」ほどの差は
 *    見当たらなかった(観光案内所という名前付きの別地物もOSMには見当たらない)。
 *    実在の施設の点としてこちらを採用する
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const NANOKAMACHI_ID = "e265a906-e999-44b5-aeb2-c4d16a321339";
const TAKEHARA_MACHINAMI_ID = "5fb3b93f-af24-489e-a7f4-c89c37d15290";
const MICHINOEKI_ID = "34244bcd-1583-4988-9f42-ca65f852ee12";

const fixes = [
  { id: NANOKAMACHI_ID, lat: 37.5005983, lng: 139.9200683, label: "七日町通り(OSM node 4558051859)" },
  { id: TAKEHARA_MACHINAMI_ID, lat: 34.3472711, lng: 132.9097879, label: "竹原町並み保存地区(OSM way 310849137)" },
  { id: MICHINOEKI_ID, lat: 34.3439265, lng: 132.9122105, label: "道の駅たけはら(OSM way 1117343021)" },
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

/**
 * いちご狩り#2(伊豆長岡, 0ba3c742)の座標の直し(法務指摘、2026-10-13)。
 * 1. 江川邸: OSMの江川邸(way 247433912)から約420mずれていたため、同wayの
 *    実際の建物の点(全ノードの中心、35.0546843,138.9592637)に修正
 * 2. 蛭ヶ島公園: 貸自転車の点(node 11345414405、ハローサイクリングの
 *    ステーション)と同じ点だったため、公園本体(way 619254284)の点
 *    (35.0516373,138.9518462)に修正
 * 3. 伊豆パノラマパーク: 出どころ不明の点だったため、ロープウェイ山麓駅
 *    (way 551923222、aerialway=station、「山麓」The Foot Of The Mountain、
 *    35.0265553,138.9283821)に修正。山頂駅(way 1000486687)も見つけたが、
 *    来園者が実際に訪れ、ロープウェイに乗る施設の入口はふもと側のため、
 *    こちらを使う
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const EGAWA_ID = "09e4dc85-b84f-465b-9cb0-eab50181d024";
const HIRUGASHIMA_ID = "a4af490e-4b24-49ea-aa27-bcddeda25c95";
const PANORAMA_ID = "a334f29e-f9f9-4d27-895c-e636192f0728";

const fixes = [
  { id: EGAWA_ID, lat: 35.0546843, lng: 138.9592637, label: "江川邸(OSM way 247433912)" },
  { id: HIRUGASHIMA_ID, lat: 35.0516373, lng: 138.9518462, label: "蛭ヶ島公園(OSM way 619254284)" },
  { id: PANORAMA_ID, lat: 35.0265553, lng: 138.9283821, label: "伊豆パノラマパーク山麓駅(OSM way 551923222)" },
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

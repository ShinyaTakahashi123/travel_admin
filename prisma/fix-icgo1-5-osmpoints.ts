/**
 * 企画運営指摘(2026-10-13)の直し。
 * 1. #1那須 いちごの森: OSMに名前付きの地物「いちごの森」(node 5898571795、
 *    shop=greengrocer、37.0193367,140.0310636)が見つかり、直前に使った
 *    国土地理院の番地の点から約140m。座標の決まり(OSM名前付き地物→番地)の
 *    順により、OSMの点に差し替える
 * 2. #5うきは 田主丸駅とかっぱの町並み: OSMの地区の点「田主丸町田主丸」
 *    (node 9013196487、place=quarter)と同じだったため、田主丸駅の実点
 *    (node 265888949、33.3387991,130.6923219)に修正
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ICHIGONOMORI_ID = "cc9db79a-f746-421f-9e0c-2bddc366f314";
const TAISHUMARU_ID = "5306a0e0-f154-4a76-bd82-e4a7e688518a";

const fixes = [
  { id: ICHIGONOMORI_ID, lat: 37.0193367, lng: 140.0310636, label: "いちごの森(OSM node 5898571795)" },
  { id: TAISHUMARU_ID, lat: 33.3387991, lng: 130.6923219, label: "田主丸駅とかっぱの町並み(OSM node 265888949 田主丸駅)" },
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

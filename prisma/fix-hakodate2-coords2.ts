/**
 * bb3ae76a（函館1泊2日）2日目の座標2か所の直し（法務指摘、2026-10-29。度分秒からの換算値）
 * - 函館ハリストス正教会: OSM way 254175356（place_of_worship, Nominatimの中心）41.762845,140.712213
 * - 旧函館区公会堂: OSM node 2519645005（tourism=attraction）41.765038,140.708921
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const HARISTOS = "8006f46d-5387-4a00-9a08-bb1d210d908c";
const KOKAIDO = "3308a98d-939e-4737-ba44-fa09cb962337";

const FIXES = [
  { id: HARISTOS, name: "函館ハリストス正教会", oldLat: "41.762778", oldLng: "140.712222", newLat: 41.762845, newLng: 140.712213, source: "OSM way 254175356（Nominatimの中心）" },
  { id: KOKAIDO, name: "旧函館区公会堂", oldLat: "41.765028", oldLng: "140.708889", newLat: 41.765038, newLng: 140.708921, source: "OSM node 2519645005" },
];

async function main() {
  const spots = await prisma.spot.findMany({
    where: { id: { in: FIXES.map((f) => f.id) } },
    select: { id: true, lat: true, lng: true },
  });
  const byId = new Map(spots.map((s) => [s.id, s]));

  for (const f of FIXES) {
    const s = byId.get(f.id);
    if (!s) throw new Error(`spot not found: ${f.id}`);
    if (s.lat?.toString() !== f.oldLat || s.lng?.toString() !== f.oldLng) {
      throw new Error(`${f.name}(${f.id}): 現在値が期待と不一致。現在値=${s.lat},${s.lng} 期待値=${f.oldLat},${f.oldLng}`);
    }
  }
  console.log("前提の確認OK。\n");

  for (const f of FIXES) {
    console.log(`[${f.name}] ${f.oldLat},${f.oldLng} → ${f.newLat},${f.newLng}（出典: ${f.source}）`);
  }

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(
    FIXES.map((f) => prisma.spot.update({ where: { id: f.id }, data: { lat: f.newLat, lng: f.newLng } }))
  );
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());

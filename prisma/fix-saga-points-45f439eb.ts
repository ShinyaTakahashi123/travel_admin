/**
 * 佐賀(45f439eb)の点の直し漏れ(法務の本番確認で発見、2026-11-03)。
 * fix-saga-45f439eb.ts の v3 で、歩く分はv1で調べた新しい点で計算していたのに、
 * data に lat/lng を入れ忘れていた(彫刻の森の新規作成分だけ入っていた)。
 * 時刻・滞在・区間・文は変えず、5か所の lat/lng だけを直す。
 *
 * 新しい値(制作補助2の下調べ、v1で確認した値):
 * - 佐嘉神社拝殿 node5599101701
 * - 佐賀県立博物館・美術館 way249574451
 * - 佐賀城本丸歴史館 way511628392
 * - 高伝寺 way586910828
 * - 佐賀バルーンミュージアム node5211905043
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const FIXES = [
  { id: "a77c7fa5-9097-473d-b57e-8a6a31530f6e", name: "佐嘉神社", oldLat: 33.251144, oldLng: 130.302719, newLat: 33.2518209, newLng: 130.3025552, osm: "node5599101701" },
  { id: "a8f3ea24-6a71-402b-8d18-7241b30a9f85", name: "佐賀県立博物館・美術館", oldLat: 33.251369, oldLng: 130.301422, newLat: 33.2449798, newLng: 130.3005335, osm: "way249574451" },
  { id: "e1848bd1-1b96-4e88-bd1e-51f27339c842", name: "佐賀城本丸歴史館", oldLat: 33.244301, oldLng: 130.301727, newLat: 33.245343, newLng: 130.3029691, osm: "way511628392" },
  { id: "f142756d-7c40-4cf1-87c0-c0ee10e6d3f0", name: "高伝寺", oldLat: 33.240166, oldLng: 130.288803, newLat: 33.2379248, newLng: 130.2832405, osm: "way586910828" },
  { id: "0e774d4b-4597-49c0-8c32-fe746c085356", name: "佐賀バルーンミュージアム", oldLat: 33.252417, oldLng: 130.300417, newLat: 33.2524694, newLng: 130.3003905, osm: "node5211905043" },
];

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  for (const f of FIXES) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id: f.id } });
    if (Math.abs(s.lat - f.oldLat) > 0.00001 || Math.abs(s.lng - f.oldLng) > 0.00001) {
      throw new Error(`${f.name}: 現在値が期待と不一致 (現在 ${s.lat},${s.lng})`);
    }
    console.log(`\n[${f.name}]`);
    console.log(`旧: ${f.oldLat},${f.oldLng}`);
    console.log(`新: ${f.newLat},${f.newLng} (OSM ${f.osm})`);
  }
  console.log("\n時刻・滞在・区間・文は変えません。");

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    for (const f of FIXES) {
      await tx.spot.update({ where: { id: f.id }, data: { lat: f.newLat, lng: f.newLng } });
    }
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

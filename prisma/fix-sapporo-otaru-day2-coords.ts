/**
 * 180bc90c（さっぽろ雪まつりと小樽雪あかりの路）Day2(小樽)の座標5点の直し（法務指摘、2026-10-30）
 * 初日の時刻見直しとは別件。7章の決まりで、見直しの中でしおりの全部の点を確かめた結果。
 *
 * - 小樽寿司屋通り: 旧値は小樽掖済会病院(node 5417517122)の点と0mで同じだった→
 *   OSM way 38939785「寿司屋通り」のNominatim値
 * - 旧手宮線: 線の跡（disused:railway）はNominatimで中心が出ないため、歩く場所
 *   （色内のあたり、小樽市総合博物館本館へ向かう側）に近い、南側の区間
 *   way 38939644 の生データの点をそのまま使う。node 462792232（北端、本館側）
 * - 小樽市総合博物館運河館: OSM way 1444266306 の値（旧値から約31mずれ）
 * - 小樽オルゴール堂本館: OSM node 1256671137「小樽オルゴール堂」の値（旧値から約4mずれ）
 * - 小樽市総合博物館本館: 旧値は展示車両(node 12330901147「DD13 611」)の点だった→
 *   OSM way 438955552「総合博物館」の値
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const SUSHIYA = "db73a40e-7544-4894-8664-e6b51f7fcda2";
const TEMIYASEN = "b731942e-c256-4f95-b0b5-09466bc1a068";
const UNGAKAN = "1c359dca-f27c-43e9-9f52-5d61fd31becc";
const ORGOLE = "f81352da-ff8f-46ec-ac3a-2e1d72661364";
const HAKUBUTSUKAN_HONKAN = "d9d6fe46-9c5d-45a2-8992-335255d8d3db";

const FIXES: { id: string; name: string; oldLat: string; oldLng: string; newLat: number; newLng: number; source: string }[] = [
  { id: SUSHIYA, name: "小樽寿司屋通り", oldLat: "43.194428", oldLng: "140.998379", newLat: 43.1941253, newLng: 140.9987053, source: "OSM way 38939785" },
  { id: TEMIYASEN, name: "旧手宮線", oldLat: "43.2007", oldLng: "141.0002", newLat: 43.2006419, newLng: 140.9982343, source: "OSM node 462792232（way 38939644の北端）" },
  { id: UNGAKAN, name: "小樽市総合博物館運河館", oldLat: "43.200527", oldLng: "141.000534", newLat: 43.2006959, newLng: 141.0002232, source: "OSM way 1444266306" },
  { id: ORGOLE, name: "小樽オルゴール堂本館", oldLat: "43.190579", oldLng: "141.007837", newLat: 43.1905785, newLng: 141.007792, source: "OSM node 1256671137" },
  { id: HAKUBUTSUKAN_HONKAN, name: "小樽市総合博物館本館", oldLat: "43.211395", oldLng: "141.000198", newLat: 43.2113568, newLng: 141.0014406, source: "OSM way 438955552" },
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
  console.log(`前提の確認OK（${FIXES.length}件）。\n`);

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

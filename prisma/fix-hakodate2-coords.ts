/**
 * bb3ae76a（函館1泊2日）の座標5か所の直し（法務指摘、2026-10-29。4けた以下に丸めた値）
 * docs/content/itinerary-rules.md 7章のとおり、OSMの名前つきの地物の点に直す
 *
 * - 五稜郭タワー: OSM way 585398984（man_made=tower, name=五稜郭タワー, height=107m。
 *   メモの「高さ約107m」と一致）Nominatimの中心 41.794592,140.753959
 *   （2026-10-29 法務の指摘で修正。最初に送った値はwayの中心を自分で計算したもので、
 *   決まり7章「自分で平均を出した中心」に当たるため、Nominatimの値に直した）
 * - 五稜郭公園: 広い公園のため、境界の中心でなく、メモの「五稜郭タワーから歩いて」に
 *   合わせてタワー側の入口「一の橋」を使う。OSM way 955948102（man_made=bridge,
 *   name=一の橋）Nominatimの中心 41.795602,140.754953
 *   （2026-10-29 法務の指摘で修正。最初に送った値は五稜郭公園のwayの中心を自分で
 *   計算したもので、決まり7章の「自分で平均を出した中心」「広い公園は入口の点」の
 *   両方に当たるため、入口の点に直した）
 * - 函館朝市: OSM way 1117395054（amenity=marketplace, name=函館朝市、Nominatim検索）
 *   center 41.772239,140.724817
 * - 立待岬: OSM node 8124752999（natural=cape, name=立待岬。岬そのものの点）41.745287,140.722316
 * - 金森赤レンガ倉庫: OSM node 2476094422（shop=mall, name=金森赤レンガ倉庫）41.766184,140.716449
 *   （函館b6c6744aの同倉庫の直しで使った点と同じ。同じ実在施設のため）
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const TOWER = "e1f24cb1-08ad-4ca5-a954-fd6f6b8f570a";
const PARK = "9ce56ace-04f1-4ea6-8e99-a597ef97225a";
const ASAICHI = "17ce145e-f78d-41d5-9d6c-a62841835075";
const TACHIMACHI = "83d240bf-a232-4fbc-9ebd-8b44a485ca0d";
const AKARENGA = "37d81a11-c78f-4253-9f49-6fbd3cb64c8b";

const FIXES: { id: string; name: string; oldLat: string; oldLng: string; newLat: number; newLng: number; source: string }[] = [
  { id: TOWER, name: "五稜郭タワー", oldLat: "41.7975", oldLng: "140.7561", newLat: 41.794592, newLng: 140.753959, source: "OSM way 585398984（Nominatimの中心）" },
  { id: PARK, name: "五稜郭公園（タワー側の入口「一の橋」）", oldLat: "41.7969", oldLng: "140.7566", newLat: 41.795602, newLng: 140.754953, source: "OSM way 955948102（Nominatimの中心）" },
  { id: ASAICHI, name: "函館朝市", oldLat: "41.7736", oldLng: "140.7228", newLat: 41.772239, newLng: 140.724817, source: "OSM way 1117395054" },
  { id: TACHIMACHI, name: "立待岬", oldLat: "41.7419", oldLng: "140.7297", newLat: 41.745287, newLng: 140.722316, source: "OSM node 8124752999" },
  { id: AKARENGA, name: "金森赤レンガ倉庫", oldLat: "41.766111", oldLng: "140.7175", newLat: 41.766184, newLng: 140.716449, source: "OSM node 2476094422" },
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

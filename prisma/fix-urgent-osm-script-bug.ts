/**
 * 緊急の直し(自己点検で発見): 本セッションで使っていたOSMデータの集計スクリプト
 * (_osm-list-named.cjs)に、自己閉じ型のnode要素(<node .../>)の後に来る、別の
 * node(子要素を持つ<node ...>...</node>)のタグを、誤って手前の無名のnodeに
 * 結びつけてしまうバグがあった。このバグにより、次の3か所が、実際には
 * タグのない(名前のない)点に誤って設定されていたことが判明:
 * - #23 石鎚登山ロープウェイ: 誤 node 2096161612(タグなし) → 正 node 2483295948
 *   (aerialway=station、「下谷駅」、33.8030146,133.1481197)
 * - #23 石鎚神社 口之宮本社: 誤 node 612807210(タグなし) → 正 node 2483290088
 *   (amenity=place_of_worship、「石鎚神社」、33.8894087,133.1545435)
 * - いちご狩り#4 甘樫丘: 誤 node 806503545(タグなし) → 正 node 4049734908
 *   (tourism=viewpoint、「甘樫丘展望台」、34.47972,135.8155466。奇しくも
 *   直し前の座標とほぼ同じ点だった)
 * いずれも、今回node.js単体のnode直接取得(/api/0.6/node/<id>)で再確認済み。
 * スクリプト自体は修正済み(自己閉じnodeと子要素ありnodeを正しく区別する)。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ROPEWAY_ID = "56a4e551-a558-441a-a6e6-ab9da47461d2";
const KUCHINOMIYA_ID = "d965042c-6d92-4d26-9c80-9e59e2c988cd";
const AMAKASHI_ID = "cdffa705-95df-4b7d-958f-e0f6c2233752";

const fixes = [
  { id: ROPEWAY_ID, lat: 33.8030146, lng: 133.1481197, label: "石鎚登山ロープウェイ(正: OSM node 2483295948 下谷駅)" },
  { id: KUCHINOMIYA_ID, lat: 33.8894087, lng: 133.1545435, label: "石鎚神社 口之宮本社(正: OSM node 2483290088)" },
  { id: AMAKASHI_ID, lat: 34.47972, lng: 135.8155466, label: "甘樫丘(正: OSM node 4049734908 甘樫丘展望台)" },
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

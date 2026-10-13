/**
 * #29(沼垂テラスと今代司酒造、6eb0ef87)の座標の直し(企画運営指摘、2026-10-13)。
 * 1. 沼垂テラス商店街: 丁目の点「沼垂東三丁目」だったため、商店街内の実在の店舗
 *    (node 13022217818、shop=florist、「長谷川生花店」、37.9188846,139.0698029)
 *    に修正。店名はメモに書かない
 * 2. 萬代橋: 丁目の点「万代一丁目」だったため、橋そのもの(way 560495239、
 *    man_made=bridge、「萬代橋」、37.9195138,139.0532736)に修正
 * 3. ぽんしゅ館 新潟驛店 利き酒番所: 丁目の点「花園一丁目」(新潟交通バス案内所の
 *    点)だったため、新潟駅の駅舎そのもの(way 154083968、building=train_station、
 *    37.912021,139.0618576。利き酒番所は駅構内にある)に修正
 * 万代地区（昼食）は今回動かさず、出どころの確認のみ(チェック表に記録):
 * 現在の点は「万代シテイ」という商業エリア内の実在の通り「東港線」の点と一致。
 * 丁目の中心点ではない
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const NUMADARI_ID = "2c720ae5-bd73-455b-9d9d-a64f074fe658";
const BANDAIBASHI_ID = "e83e550e-82ba-44a6-ab6e-fbcb5f8cf78c";
const PONSHUKAN_ID = "587f0795-3e1e-4154-b4cf-00f47aefa1f6";

const fixes = [
  { id: NUMADARI_ID, lat: 37.9188846, lng: 139.0698029, label: "沼垂テラス商店街(OSM node 13022217818)" },
  { id: BANDAIBASHI_ID, lat: 37.9195138, lng: 139.0532736, label: "萬代橋(OSM way 560495239)" },
  { id: PONSHUKAN_ID, lat: 37.912021, lng: 139.0618576, label: "ぽんしゅ館 新潟驛店(OSM way 154083968 新潟駅)" },
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

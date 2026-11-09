/**
 * 初日・最終日の見直し #124〜#132 の座標の直し（しおりえ(制作補助2)、2026-10-29。法務・企画運営の指摘「けたの少ない点を OSM と比べる」）
 * 決まり: docs/content/itinerary-rules.md 7章（OSM の名前つきの地物の点をそのまま使う。Nominatim の中心を6けたに）
 * 取った地物:
 *   #124 山形市郷土館 → OSM relation 14422186（tourism=museum）
 *   #125 福江港ターミナル → OSM node 7823003972「福江」（amenity=ferry_terminal）。いまは地理院の番地の点（東浜町二丁目3番）
 *   #126 豊国神社 → OSM way 34627584（amenity=place_of_worship）／長浜城歴史博物館 → OSM node 298348191（tourism=museum）
 *   #129 京橋 → OSM way 480838429（man_made=bridge）／林原美術館 → OSM way 756070005（tourism=museum。地理院「丸の内二丁目7番15号」とも一致）
 *   #132 藤村記念館 → OSM way 226733915（tourism=museum）／信玄ミュージアム → OSM way 793329998「武田氏館跡歴史館」（tourism=museum）／
 *        仙娥滝 → OSM node 8932187243（waterway=waterfall）
 *        覚円峰 → 地理院の地名の点（天鼓林・石門は相談中で、ここでは直さない）
 * 本文・時刻は変えない（京橋は電停から約240m、林原美術館から岡山城は約300mで、つなぎの文の分数と合う）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-coords-124-132.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const FIX: { id: string; name: string; from: [number, number]; to: [number, number]; src: string }[] = [
  { id: "c7d2f61b-668c-4eaf-aac6-c2f9ec3608ac", name: "山形市郷土館(旧済生館本館)", from: [38.25326, 140.328649], to: [38.25326, 140.328549], src: "OSM relation 14422186" },
  { id: "88486eb5-6c73-4456-8b8d-f2cdb32065de", name: "福江港ターミナル", from: [32.69656, 128.851562], to: [32.696764, 128.852276], src: "OSM node 7823003972" },
  { id: "e2586b2d-c588-45f3-8a8e-95ebef4ba1df", name: "豊国神社", from: [35.3805, 136.264722], to: [35.380484, 136.265018], src: "OSM way 34627584" },
  { id: "03cab3b9-01ff-47e0-b998-0544eb6090f6", name: "長浜城歴史博物館", from: [35.3775, 136.2611], to: [35.377657, 136.261281], src: "OSM node 298348191" },
  { id: "ec7ea7f3-bb5b-4e70-915a-68717bf9cac3", name: "京橋", from: [34.6605, 133.9327], to: [34.658059, 133.933055], src: "OSM way 480838429" },
  { id: "10541d2b-a691-4112-a6bb-1daf47864e62", name: "林原美術館", from: [34.6656, 133.9294], to: [34.663607, 133.933386], src: "OSM way 756070005" },
  { id: "23d4411c-669c-41cb-a688-8511a6976271", name: "藤村記念館", from: [35.6675, 138.5686], to: [35.667814, 138.570054], src: "OSM way 226733915" },
  { id: "2143f6ca-8a81-48bb-b36f-60aa681756f9", name: "信玄ミュージアム（甲府市武田氏館跡歴史館）", from: [35.68525, 138.57706], to: [35.685253, 138.577136], src: "OSM way 793329998" },
  { id: "3d99e920-75b8-4ce6-8503-17b0ec37153a", name: "仙娥滝", from: [35.749617, 138.566302], to: [35.749478, 138.566091], src: "OSM node 8932187243" },
  // 天鼓林・石門は、まわりに名前つきの地物がなく、いちばん近いバス停も300mより遠い（約410m・約304m）ので、ここでは直さない（企画運営と相談中）
  // 覚円峰: OSM になし。地理院の地名検索の「覚円峰」の点（企画運営 10/29 OK）
  { id: "ab0f65e9-43b7-4ea1-9a6d-fbecae1a465e", name: "覚円峰", from: [35.745, 138.566389], to: [35.747328, 138.565227], src: "地理院 地名検索「覚円峰」35.7473284454103,138.565226903178" },
];

async function main() {
  for (const f of FIX) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id: f.id } });
    if (s.name !== f.name) throw new Error(`${f.id}: 名前が違います（${s.name}）`);
    if (Number(s.lat) !== f.from[0] || Number(s.lng) !== f.from[1]) throw new Error(`${f.name}: いまの座標が想定と違います（${s.lat},${s.lng}）`);
    console.log(`${f.name}: ${s.lat},${s.lng} → ${f.to.join(",")}（${f.src}）`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const f of FIX) await tx.spot.update({ where: { id: f.id }, data: { lat: f.to[0], lng: f.to[1] } });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

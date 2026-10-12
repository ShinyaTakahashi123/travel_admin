/**
 * #201 9dff2862（遠野）・#204 ac272e0b（鳴門）の座標の直し（しおりえ(制作補助2)、2026-10-01）
 * 自分で使っていた OSM の XML の読み取りに不具合があり、名前のない点（自己終了の <node/>）に、次の要素のタグが付いて見えていた。
 * 法務の #211 水ノ浦教会の指摘で気づき、自分のスクリプトの node をすべて OSM の API で確かめたところ、次の4か所が名前のない点だった:
 *   #201 五百羅漢: node 4428978392（実は高速道路の頂点）→ node 5942209985「五百羅漢」tourism=attraction 39.3231953,141.5121405
 *   #201 卯子酉神社: node 2985473525（小道の頂点）→ node 2985473528「卯子酉神社」amenity=place_of_worship 39.325419,141.5135632
 *   #204 金泉寺: node 314747817（道路の頂点）→ node 314747849「第03番札所 金泉寺」amenity=place_of_worship 34.147453,134.4685024
 *   #204 ドイツ橋: node 7211674175（屋根の頂点）→ 推定（橋のたもとの案内板 node 7211674179「ドイツ橋」tourism=information 34.1715758,134.5019627。橋そのものの点は OSM にない）
 * どれも同じ場所の近く（数十〜数百m）で、本文と時刻は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-201d-204d-osm-tags.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
// [スポットID, 名前, 今の点, 新しい点]
const FIXES: [string, string, [number, number], [number, number]][] = [
  ["8ffecaef-b1f5-4be6-858e-50f400173fb3", "五百羅漢", [39.324445, 141.505897], [39.3231953, 141.5121405]],
  ["f681181a-1440-4949-8288-d5c16be85bfe", "卯子酉神社", [39.324669, 141.511393], [39.325419, 141.5135632]],
  ["0eeea741-ac29-4ed1-a2f7-e90cce4fa017", "金泉寺", [34.146584, 134.469125], [34.147453, 134.4685024]],
  ["5282b044-6244-481f-b468-469b93a82a80", "ドイツ橋", [34.171666, 134.502033], [34.1715758, 134.5019627]],
];

async function main() {
  for (const [id, name, [lat0, lng0], [lat, lng]] of FIXES) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id } });
    if (s.name !== name || Math.abs(Number(s.lat) - lat0) > 1e-5 || Math.abs(Number(s.lng) - lng0) > 1e-5) throw new Error(`想定と違います: ${s.name} ${s.lat},${s.lng}`);
    console.log(`${name}: ${lat0},${lng0} → ${lat},${lng}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const [id, , , [lat, lng]] of FIXES) await tx.spot.update({ where: { id }, data: { lat, lng } });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

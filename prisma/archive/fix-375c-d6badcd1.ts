/**
 * #375 d6badcd1 座標の取り方の決まり（2026-09-29 法務の見方・企画運営の判断）への対応（しおりえ(制作補助2)）
 * - 昇仙峡 影絵の森美術館: JAFナビから読んだ値(35.750991,138.566333)をやめ、OSMのバス停「昇仙峡滝上」の点に差し替え
 * - 昇仙峡 水晶街道（滝上）: 手で推定した値(35.7522,138.5638)をやめ、同じくOSMのバス停「昇仙峡滝上」の点に差し替え
 *   座標の出典: OpenStreetMap（Overpass）highway=bus_stop「昇仙峡滝上」35.7509182,138.5664219（どちらもバス停の目の前）
 * - 天鼓林(35.736,138.5622)・石門(35.7482,138.5668)は、OSM・国土地理院に点がないため、企画運営の判断で例外として推定値のまま。
 *   推定の元: 昇仙峡観光協会トレッキングコースの順番（長潭橋→天鼓林→羅漢寺→…→覚円峰→長田円右衛門の碑→石門→昇仙橋→仙娥滝）、
 *   国土地理院の点（長潭橋 35.72721,138.54888／羅漢寺 35.73772,138.56141／覚円峰 35.74733,138.56523／仙娥滝 35.74962,138.56630）、
 *   OSMの荒川・県道（甲府昇仙峡線）の線。誤差は数百m。より良い点が見つかったら差し替える
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-375c-d6badcd1.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
const ITINERARY_ID = "d6badcd1-3d74-443c-acff-931643910c69";
const TAKIUE = { lat: 35.750918, lng: 138.566422 };
async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: { in: ["昇仙峡 影絵の森美術館", "昇仙峡 水晶街道（滝上）"] } } });
  if (spots.length !== 2) throw new Error("対象が2件ではありません");
  for (const s of spots) console.log(`${s.name} ${s.lat},${s.lng} → ${TAKIUE.lat},${TAKIUE.lng}`);
  if (!process.argv.includes("--commit")) return console.log("確認モード");
  await prisma.$transaction(spots.map((s) => prisma.spot.update({ where: { id: s.id }, data: TAKIUE })));
  console.log("書き込みました。");
}
main().catch((e) => { console.error(e?.message); process.exit(1); }).finally(() => prisma.$disconnect());

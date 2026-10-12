/**
 * #248 11c84229 の続き（しおりえ(制作補助2)）: 法務の確認（2026-10-11 15:09、記録 025d279）で、長寿院の座標を国土地理院の番地の点から
 *   OSM の node 4389672844「大洞弁財天」（amenity=place_of_worship・wikipedia=ja:長寿院、API で確かめた）35.285595, 136.265164 に直す（OSM に点があるときは OSM を先に使う）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-248b-11c84229.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "11c84229-c8b8-4d6e-88ea-6fe27e538abf";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "長寿院" } });
  if (s.length !== 1 || Math.abs(Number(s[0].lat) - 35.284252) > 1e-6) throw new Error("想定と違います");
  console.log(`長寿院 ${s[0].lat},${s[0].lng} → 35.285595,136.265164`);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: s[0].id }, data: { lat: 35.285595, lng: 136.265164 } });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

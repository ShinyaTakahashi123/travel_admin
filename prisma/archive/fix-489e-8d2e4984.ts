/**
 * #489 8d2e4984 の座標の直し（しおりえ(制作補助2)、2026-10-01 法務・企画運営の判断「案C」）
 * - 4日目の五箇山民俗館: 隣の塩硝の館の点（node 1420913961）は別の施設の点なので使わない。
 *   OSM の民俗館の点（node 479724758）は約1km南の国道上にずれ、国土地理院は「菅沼436」で大字の点しか返さない。
 *   民俗館は「菅沼集落の中ほどに位置する」（とやま観光 https://www.info-toyama.com/attractions/41004 ）ので、
 *   推定（集落の点）として、OSM の菅沼集落そのものの点 node 4551744289「越中五箇山菅沼集落」（tourism=attraction、heritage=1）36.4051867,136.8860765 にする。
 *   3日目の菅沼合掌造り集落（史跡の碑 node 5059456024）とは約100m離れた別の点
 *   （菅沼に泊まって4日目を民俗館から始める組み立ては、世界遺産バスの始発（菅沼 9:46）の都合で変えられないため。加越能バス https://www.kaetsunou.co.jp/regular/sekaiisan ）
 * - 4日目の相倉合掌造り集落: 集落の中の地主神社の点（node 4400562292）は別の施設の点なので、相倉集落そのものの点 node 4485300889「越中五箇山相倉集落」（tourism=attraction）36.426177,136.9355622 にする
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-489e-8d2e4984.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "8d2e4984-c29c-43dd-a049-b39c6bbb8b5b";
const COMMIT = process.argv.includes("--commit");
// [スポットID, 名前, 今の点, 新しい点]
const FIXES: [string, string, [number, number], [number, number]][] = [
  ["b2a1078b-bdaa-41b3-9391-2beaf831c837", "五箇山民俗館", [36.404116, 136.886962], [36.4051867, 136.8860765]],
  ["0c925149-9cd1-4348-a9de-7066a4db2726", "相倉合掌造り集落", [36.426724, 136.935348], [36.426177, 136.9355622]],
];

async function main() {
  for (const [spotId, name, [lat0, lng0]] of FIXES) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 4, spotId });
    if (s.name !== name || Math.abs(Number(s.lat) - lat0) > 1e-5 || Math.abs(Number(s.lng) - lng0) > 1e-5) throw new Error(`想定と違います: ${s.name} ${s.lat},${s.lng}`);
  }
  for (const [, name, [lat0, lng0], [lat, lng]] of FIXES) console.log(`${name}: ${lat0},${lng0} → ${lat},${lng}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      for (const [spotId, , , [lat, lng]] of FIXES) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 4, spotId }, { lat, lng }, { tx });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #249 124d62bc の続き（しおりえ(制作補助2)）: 法務の確認（2026-10-11 15:14、記録 4eb8bfa）で、道の駅桃山天下市の座標を名前のない建物の点から
 *   OSM の「道の駅；桃山天下市」way 407222687 の Nominatim の中心 33.528357, 129.873068 に直す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-249b-124d62bc.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "124d62bc-9be4-4cec-b809-ba6361fa217b";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "道の駅桃山天下市" } });
  if (s.length !== 1 || Math.abs(Number(s[0].lat) - 33.5287036) > 1e-6) throw new Error("想定と違います");
  console.log(`道の駅 ${s[0].lat},${s[0].lng} → 33.528357,129.873068`);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: s[0].id }, data: { lat: 33.528357, lng: 129.873068 } });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

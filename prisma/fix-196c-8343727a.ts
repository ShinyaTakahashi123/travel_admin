/**
 * #196 8343727a の続き（しおりえ(制作補助2)）: 企画運営の確認で、旭川さくらみちの丸めた座標（34.6702,133.9349）を OSM の点にする
 *   way 241890657「旭川さくらみち」（highway=tertiary、embankment=yes）の Nominatim の中心 34.6708233,133.9343408
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-196c-8343727a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "8343727a-f061-4eba-bdba-92d051fc3d0e";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "旭川さくらみち" } });
  if (s.length !== 1) throw new Error(`旭川さくらみち ${s.length}件`);
  console.log(`座標 ${s[0].lat},${s[0].lng} → 34.6708233,133.9343408`);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: s[0].id }, data: { lat: 34.6708233, lng: 133.9343408 } });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

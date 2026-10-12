/**
 * #435 8e7d688e の追いの修正2（しおりえ(制作補助2)、企画運営の指摘）: 水澤寺の座標を、水沢の集落の点（36.479412,138.947806、寺から約250m）から、
 *   寺の目の前のバス停「水沢観音」の点に直す（Nominatim 36.4811000,138.9457703）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-435c-8e7d688e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "8e7d688e-1378-4f2e-a324-47bbc747576c";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "水澤寺" });
  console.log(`水澤寺 ${s.lat},${s.lng} → 36.4811,138.94577`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { lat: 36.4811, lng: 138.94577 }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

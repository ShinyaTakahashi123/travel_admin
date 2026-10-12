/**
 * #474 91dbe03a の追いの直し（しおりえ(制作補助2)、itinerary-audit「時刻の計算が合わない(間5分/移動3分)」）: 門前町商店街までの歩きを5分に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-474b-91dbe03a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "91dbe03a-f372-4db4-92c6-c97ab9246310";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "門前町商店街" });
  console.log(`門前町商店街 ${spot.id}: 歩き3分→5分`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: spot.id }, { transitDurationMin: 5 }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

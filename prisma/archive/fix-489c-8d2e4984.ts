/**
 * #489 8d2e4984 の座標の直し（しおりえ(制作補助2)、#209 の見直しのときに気づいた）
 * 3日目の菅沼合掌造り集落が、地名の点（OSM node 8959032842「菅沼」）になっていた。地名の点は使わない決まりなので、
 *   集落の中の史跡の碑「国指定史跡越中五箇山菅沼集落」（OSM node 5059456024、36.4044030,136.8866010）に直す（#209 と同じ点）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-489c-8d2e4984.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "8d2e4984-c29c-43dd-a049-b39c6bbb8b5b";
const SPOT_ID = "155df849-d0be-4ea5-8902-768cf40249fe";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 3, spotId: SPOT_ID });
  if (s.name !== "菅沼合掌造り集落" || Math.abs(Number(s.lat) - 36.399578) > 1e-5 || Math.abs(Number(s.lng) - 136.886868) > 1e-5) throw new Error(`想定と違います: ${s.name} ${s.lat},${s.lng}`);
  console.log(`${s.name}: ${s.lat},${s.lng} → 36.404403,136.886601`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 3, spotId: SPOT_ID }, { lat: 36.404403, lng: 136.886601 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

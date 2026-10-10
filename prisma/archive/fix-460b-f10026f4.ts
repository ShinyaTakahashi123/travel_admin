/**
 * #460 f10026f4 の座標の直し（しおりえ(制作補助2)、itinerary-audit の指摘: ロープウェイ→女体山 1.3km に歩き10分は速すぎ）
 *   ロープウェイの点を、乗った先の女体山駅（OSM node 389739036、標高840m）に。女体山の山頂までは歩いてすぐ
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-460b-f10026f4.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "f10026f4-2dda-43fa-84f9-6b2c5654e616";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "筑波山ロープウェイ" });
  console.log("筑波山ロープウェイ: 36.22502,140.106464（女体山駅）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: spot.id }, { lat: 36.22502, lng: 140.106464, address: "茨城県つくば市筑波（女体山駅）" });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

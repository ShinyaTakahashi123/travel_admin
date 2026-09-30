/**
 * #426 6e5b2d45 の追いの修正（しおりえ(制作補助2)、企画運営の指摘）: 座標を行き先そのものの点に
 *   - 鵜原理想郷: 鵜原駅の点（入口まで徒歩約7分）→ OSM の理想郷内の展望地「手弱女平」node 2713711768（35.131791,140.278087）
 *   - かつうら海中公園 海中展望塔: 海中公園の点 → OSM の「勝浦海中展望塔」node 3379582849（35.132696,140.283612）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-426e-6e5b2d45.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "6e5b2d45-92e1-4cfe-913d-b80babce8573";
const COMMIT = process.argv.includes("--commit");
const fixes = [
  { name: "鵜原理想郷", lat: 35.131791, lng: 140.278087 },
  { name: "かつうら海中公園 海中展望塔", lat: 35.132696, lng: 140.283612 },
];

async function main() {
  const plans = [];
  for (const f of fixes) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: f.name });
    console.log(`${f.name}: ${s.lat},${s.lng} → ${f.lat},${f.lng}`);
    plans.push({ id: s.id, lat: f.lat, lng: f.lng });
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const p of plans) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: p.id }, { lat: p.lat, lng: p.lng }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

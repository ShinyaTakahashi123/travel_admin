/**
 * #484 8c8c6db8 の追いの直し（しおりえ(制作補助2)、itinerary-audit の指摘「滞在90分」）
 *   太助灯籠 13:25〜13:55（30分。港のまわりを歩く）→（歩き20分）資料館 14:15〜15:10（55分）→（歩き5分）丸亀城 15:15〜16:30（75分）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-484b-8c8c6db8.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "8c8c6db8-2e32-4d3d-82c4-662914a2ee14";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const PLAN = [
  { name: "太助灯籠", visitTime: t(13, 25), stayDurationMin: 30 },
  { name: "丸亀市立資料館", visitTime: t(14, 15), stayDurationMin: 55 },
  { name: "丸亀城", visitTime: t(15, 15), stayDurationMin: 75 },
];

async function main() {
  const spots = [];
  for (const p of PLAN) spots.push({ p, s: await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: p.name }) });
  for (const { p } of spots) console.log(`${p.name}: ${p.visitTime.toISOString().slice(11, 16)} +${p.stayDurationMin}分`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const { p, s } of spots) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { visitTime: p.visitTime, stayDurationMin: p.stayDurationMin }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

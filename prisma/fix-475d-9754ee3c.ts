/**
 * #475 9754ee3c の時刻の直し（しおりえ(制作補助2)、企画運営 9/30 20:37 の確認）
 *   別府ロープウェイ（停留所）から別府駅西口へ下る36番は 8:35・9:35・10:40・11:20・12:40… 発で、所要22分（https://www.navitime.co.jp/bus/diagram/timelist?departure=00507253&arrival=00507238&line=00079439）
 *   鶴見岳の山上を10:45に出てロープウェイで下り、11:20発に乗ると別府公園前は11:40ごろ → 別府公園以降の時刻を20分うしろへずらす
 *   別府公園 11:40〜12:10（移動55分・待ち時間込み）→ 竹瓦小路（昼食）12:30〜13:25 → 竹瓦温泉 13:30〜14:30 → 別府タワー 14:40〜15:15 → 竹細工伝統産業会館 15:45〜16:35
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-475d-9754ee3c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "9754ee3c-be4b-4db8-838f-348335a26701";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const plan: { name: string; h: number; m: number; stay: number; min: number }[] = [
  { name: "別府公園", h: 11, m: 40, stay: 30, min: 55 },
  { name: "竹瓦小路", h: 12, m: 30, stay: 55, min: 20 },
  { name: "竹瓦温泉", h: 13, m: 30, stay: 60, min: 5 },
  { name: "別府タワー", h: 14, m: 40, stay: 35, min: 10 },
  { name: "別府市竹細工伝統産業会館", h: 15, m: 45, stay: 50, min: 30 },
];

async function main() {
  const spots = [];
  for (const p of plan) spots.push({ p, spot: await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: p.name }) });
  for (const { p } of spots) console.log(`${p.name}: ${p.h}:${String(p.m).padStart(2, "0")} +${p.stay}（移動${p.min}分）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const { p, spot } of spots) {
      await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: spot.id }, { visitTime: t(p.h, p.m), stayDurationMin: p.stay, transitDurationMin: p.min }, { tx });
    }
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

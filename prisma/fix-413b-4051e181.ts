/**
 * #413 4051e181 の追いの修正（しおりえ(制作補助2)、自分の点検で）
 * - 時刻の空きを詰める（itinerary-audit の「時刻の計算が合わない」）。高千穂峡→道の駅は0.8kmなので車で約5分に
 *   高千穂峡 11:00〜12:30／道の駅 12:35〜13:35（車5分）／高千穂神社 13:40〜14:25／槵觸神社 14:30〜15:15／国見ヶ丘 15:30〜16:20
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-413b-4051e181.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "4051e181-6ad7-4f7a-8270-b9ed12c4231f";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const PLAN: [string, Record<string, unknown>][] = [
  ["高千穂峡", { visitTime: t(11, 0), stayDurationMin: 90 }],
  ["道の駅高千穂（昼食）", { visitTime: t(12, 35), stayDurationMin: 60, transitDurationMin: 5 }],
  ["高千穂神社", { visitTime: t(13, 40), stayDurationMin: 45 }],
  ["槵觸神社", { visitTime: t(14, 30), stayDurationMin: 45 }],
  ["国見ヶ丘", { visitTime: t(15, 30), stayDurationMin: 50 }],
];

async function main() {
  const spots = [];
  for (const [name, data] of PLAN) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: name });
    const extra: Record<string, unknown> = {};
    if (name === "道の駅高千穂（昼食）") {
      if (!s.memo?.startsWith("高千穂峡から車で約10分。")) throw new Error("道の駅の本文が想定と違います");
      extra.memo = s.memo.replace("高千穂峡から車で約10分。", "高千穂峡から車で約5分。");
    }
    spots.push({ id: s.id, data: { ...data, ...extra } });
    console.log(name, JSON.stringify({ ...data, memo: extra.memo ? "（書き出しを約5分に）" : undefined }));
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const s of spots) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, s.data, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

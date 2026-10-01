/**
 * #497 d1855002 の追いの直し（しおりえ(制作補助2)、2026-10-01 自分の確かめ: flow-check・prayer-check）
 * - 石垣港離島ターミナル周辺: 帰りの一言をはっきり（「帰りの飛行機」）
 * - 宮良殿内: 屋敷の見学の配慮の一文
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-497b-d1855002.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "d1855002-4a6f-49db-a684-3d014966ad0a";
const COMMIT = process.argv.includes("--commit");
const EDITS: { dayNumber: number; spotName: string; from: string; to: string }[] = [
  { dayNumber: 3, spotName: "石垣港離島ターミナル周辺", from: "このあとはレンタカーを返して、新石垣空港へ向かいましょう。", to: "このあとはレンタカーを返して、新石垣空港から帰りの飛行機に乗りましょう。" },
  { dayNumber: 3, spotName: "宮良殿内", from: "見学できる日は公式の案内で確かめましょう。", to: "大切に守られてきた屋敷ですので、建物や庭を傷めないよう、静かに見学しましょう。見学できる日は公式の案内で確かめましょう。" },
];

async function main() {
  const plan = [];
  for (const e of EDITS) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: e.dayNumber, spotName: e.spotName });
    if (!s.memo?.includes(e.from)) throw new Error(`本文が想定と違います: ${e.spotName}`);
    const memo = s.memo.replace(e.from, e.to);
    console.log(`\n${e.spotName}: ${memo}`);
    plan.push({ e, id: s.id, memo });
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const p of plan) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: p.e.dayNumber, spotId: p.id }, { memo: p.memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

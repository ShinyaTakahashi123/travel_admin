/**
 * #207 ad1e92a5 の追いの直し（しおりえ(制作補助2)、2026-10-01 自分の確かめ: itinerary-audit）
 * - 唐戸市場「金曜から日曜と祝日には」は曜日の記載なので「週末などには」に
 * - 門司港駅「鉄道の駅舎として初めて国の重要文化財に指定されました」→「初めて…指定されたとされます」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-207b-ad1e92a5.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "ad1e92a5-bfea-413b-9385-efd118b1c89a";
const COMMIT = process.argv.includes("--commit");
const EDITS: [string, string, string][] = [
  ["唐戸市場", "金曜から日曜と祝日には、", "週末などには、"],
  ["門司港駅", "鉄道の駅舎として初めて国の重要文化財に指定されました。", "鉄道の駅舎として初めて国の重要文化財に指定されたとされます。"],
];

async function main() {
  const plan: { id: string; memo: string }[] = [];
  for (const [name, a, b] of EDITS) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: name });
    if (!s.memo?.includes(a)) throw new Error(`${name}: 本文が想定と違います`);
    plan.push({ id: s.id, memo: s.memo.replace(a, b) });
    console.log(`${name}: ${a} → ${b}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const p of plan) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: p.id }, { memo: p.memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

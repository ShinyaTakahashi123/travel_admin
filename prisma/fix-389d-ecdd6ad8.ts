/**
 * #389 ecdd6ad8 の追いの修正その3（しおりえ(制作補助2)、法務の指摘）
 * - 竹林院群芳園: 「大和三庭園」の一つに数えられています → 一つともいわれています
 * - 金峯山寺: 仁王門の修理の状況は公式の案内で確かめる旨を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-389d-ecdd6ad8.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "ecdd6ad8-31a0-4e4d-9816-7297a3025225";
const COMMIT = process.argv.includes("--commit");

const EDITS = [
  { name: "竹林院群芳園", old: "「大和三庭園」の一つに数えられています。", new: "「大和三庭園」の一つともいわれています。" },
  {
    name: "金峯山寺",
    old: "国宝の仁王門は大規模な修理の最中なので、蔵王堂を中心にお参りしましょう。",
    new: "国宝の仁王門は大規模な修理の最中なので、蔵王堂を中心にお参りしましょう（修理の状況は公式の案内で確かめてください）。",
  },
];

async function main() {
  const plan = [];
  for (const e of EDITS) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: e.name });
    if (!s.memo?.includes(e.old)) throw new Error(`${e.name}: 本文が想定と違います`);
    plan.push({ id: s.id, memo: s.memo.replace(e.old, e.new) });
    console.log(`${e.name}: ${e.new}`);
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

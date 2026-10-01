/**
 * #207 ad1e92a5 法務の任意の提案（しおりえ(制作補助2)、2026-10-01）
 * - 門司港レトロ展望室: 住まいの建物の中なので「静かに見学しましょう」
 * - 巌流島: 船島神社に祈りの一文
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-207d-ad1e92a5.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "ad1e92a5-bfea-413b-9385-efd118b1c89a";
const COMMIT = process.argv.includes("--commit");
const EDITS: [string, string, string][] = [
  ["門司港レトロ展望室", "渡ってきた下関の町を見渡せます。", "渡ってきた下関の町を見渡せます。住まいの建物の中にあるので、静かに見学しましょう。"],
  ["巌流島", "船島神社などをめぐりましょう。", "船島神社などをめぐりましょう。神社では静かに、敬意をもってお参りください。"],
];

async function main() {
  const plan: { id: string; memo: string }[] = [];
  for (const [name, a, b] of EDITS) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: name });
    if (!s.memo?.includes(a)) throw new Error(`${name}: 本文が想定と違います`);
    plan.push({ id: s.id, memo: s.memo.replace(a, b) });
  }
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const p of plan) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: p.id }, { memo: p.memo }, { tx });
  });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

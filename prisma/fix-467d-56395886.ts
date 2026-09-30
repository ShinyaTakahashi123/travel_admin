/**
 * #467 56395886 の追いの修正（しおりえ(制作補助2)、法務の指摘）
 *   - 上野東照宮「出世・勝利・健康長寿に特にご利益があるとされています」→ 体のことのご利益を言う形を避け「出世や勝利、健康長寿を願う人がお参りする神社です」
 *   - 上野恩賜公園「日本で初めて公園に指定された場所の一つです」→「…一つとされます」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-467d-56395886.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "56395886-d541-4396-b650-e006867bef6a";
const COMMIT = process.argv.includes("--commit");
const fixes = [
  { name: "上野東照宮", from: "上野東照宮は、出世・勝利・健康長寿に特にご利益があるとされています。", to: "上野東照宮は、出世や勝利、健康長寿を願う人がお参りする神社です。" },
  { name: "上野恩賜公園", from: "日本で初めて公園に指定された場所の一つです。", to: "日本で初めて公園に指定された場所の一つとされます。" },
];

async function main() {
  const plans = [];
  for (const f of fixes) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: f.name });
    if (!s.memo?.includes(f.from)) throw new Error(`${f.name}: 本文が想定と違います`);
    const memo = s.memo.replace(f.from, f.to);
    plans.push({ id: s.id, memo });
    console.log(`${f.name}: …${f.to}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const p of plans) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: p.id }, { memo: p.memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

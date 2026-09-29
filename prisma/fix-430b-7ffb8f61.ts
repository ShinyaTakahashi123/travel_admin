/**
 * #430 7ffb8f61 の追いの修正（しおりえ(制作補助2)、法務の指摘）
 *   - 唐津神社「唐津最大の祭り『唐津くんち』」→「唐津を代表する祭り『唐津くんち』」
 *   - 波戸岬に安全の一文「岬の岩場や海沿いでは、足元に気をつけましょう。」を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-430b-7ffb8f61.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "7ffb8f61-d19a-40e0-bb07-3e43d3908ca2";
const COMMIT = process.argv.includes("--commit");
const EDITS: [number, string, string, string][] = [
  [2, "唐津神社", "唐津最大の祭り「唐津くんち」", "唐津を代表する祭り「唐津くんち」"],
  [1, "波戸岬", "岬の名物・さざえのつぼ焼きも味わえます。", "岬の名物・さざえのつぼ焼きも味わえます。岬の岩場や海沿いでは、足元に気をつけましょう。"],
];

async function main() {
  const rows = [];
  for (const [day, name, from, to] of EDITS) {
    const s = await prisma.spot.findFirstOrThrow({ where: { name, day: { itineraryId: ITINERARY_ID, dayNumber: day } }, select: { id: true, memo: true } });
    if (!s.memo?.includes(from)) throw new Error(`本文が想定と違います: ${name}`);
    rows.push({ day, id: s.id, memo: s.memo.replace(from, to) });
    console.log(name, "→", s.memo.replace(from, to).slice(-90));
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const r of rows) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: r.day, spotId: r.id }, { memo: r.memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

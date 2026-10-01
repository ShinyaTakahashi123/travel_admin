/**
 * #452 ced5ac2b の言い回しの直し（しおりえ(制作補助2)、itinerary-audit の指摘「言い切り?」）
 *   喜多院「日本三大羅漢の一つに数えられる」→「日本三大羅漢の一つとされる」、仙波東照宮「日本三大東照宮の一つに数えられます」→「日本三大東照宮の一つとされます」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-452b-ced5ac2b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "ced5ac2b-e034-4d4c-be65-467521eac189";
const COMMIT = process.argv.includes("--commit");
const FIXES: [string, string, string][] = [
  ["喜多院", "日本三大羅漢の一つに数えられる五百羅漢", "日本三大羅漢の一つとされる五百羅漢"],
  ["仙波東照宮", "日本三大東照宮の一つに数えられます。", "日本三大東照宮の一つとされます。"],
];

async function main() {
  const todo: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  for (const [name, from, to] of FIXES) {
    const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: name });
    if (!(spot.memo ?? "").includes(from)) throw new Error(`本文が想定と違います: ${name}`);
    todo.push({ spot, memo: (spot.memo ?? "").replace(from, to) });
    console.log(`${name}: …${to}…`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const { spot, memo } of todo) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: spot.id }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

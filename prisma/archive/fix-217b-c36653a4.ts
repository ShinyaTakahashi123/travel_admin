/**
 * #217 c36653a4 の追いの直し（しおりえ(制作補助2)、audit の言い切りの注意）
 * - 旧手宮線「北海道で初めて開通した」を「北海道で初めて開通したとされる」に
 * - 天狗山「「北海道三大夜景」のひとつに数えられる」を「「北海道三大夜景」のひとつといわれる」に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-217b-c36653a4.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "c36653a4-5028-4cd1-8a44-da82c154eebf";
const COMMIT = process.argv.includes("--commit");
const REP: [string, string, string][] = [
  ["旧手宮線", "1880年に北海道で初めて開通した官営幌内鉄道", "1880年に北海道で初めて開通したとされる官営幌内鉄道"],
  ["天狗山", "「北海道三大夜景」のひとつに数えられる夜景も広がります。", "「北海道三大夜景」のひとつといわれる夜景も広がります。"],
];

async function main() {
  const ups: [string, string][] = [];
  for (const [name, a, b] of REP) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: name });
    if (!s.memo?.includes(a)) throw new Error(`${name}: 本文が想定と違います`);
    ups.push([name, s.memo.replace(a, b)]);
    console.log(`${name}: …${b}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const [name, memo] of ups) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: name }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

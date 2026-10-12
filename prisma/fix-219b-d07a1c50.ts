/**
 * #219 d07a1c50 の追いの直し（しおりえ(制作補助2)、audit の言い切りの注意）
 * - 益救神社「日本の最も南の式内社として記された」を「日本の最も南の式内社として記されたとされる」に
 * - 一湊海水浴場「島の最も北にある浜へ」を「島の最も北にあるとされる浜へ」に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-219b-d07a1c50.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "d07a1c50-be6b-4572-952d-a25feeebf78d";
const COMMIT = process.argv.includes("--commit");
const REP: [string, string, string][] = [
  ["益救神社", "日本の最も南の式内社として記された神社で、", "日本の最も南の式内社として記されたとされる神社で、"],
  ["一湊海水浴場", "島の最も北にある浜へ。", "島の最も北にあるとされる浜へ。"],
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

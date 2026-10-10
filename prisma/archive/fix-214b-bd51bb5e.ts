/**
 * #214 bd51bb5e の追いの直し（しおりえ(制作補助2)、自分の点検で）
 * - 風土記の丘資料館「古墳群で最も大きな前方後円墳」を伝聞（〜とされる）に（audit の言い切りの注意）
 * - 龍角寺古墳群・岩屋古墳に、お墓への配慮の一文（prayer-check）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-214b-bd51bb5e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "bd51bb5e-0c5c-4b1e-98de-c6a125a64de5";
const COMMIT = process.argv.includes("--commit");
const REP: [string, string, string][] = [
  ["風土記の丘資料館", "古墳群で最も大きな前方後円墳・浅間山古墳", "古墳群で最も大きな前方後円墳とされる浅間山古墳"],
  ["龍角寺古墳群・岩屋古墳", "遊歩道から外れないように歩きましょう。", "古墳は昔の人のお墓ですので、静かに見学しましょう。遊歩道から外れないように歩きましょう。"],
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

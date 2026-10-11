/**
 * #220 d0a83d9f の追いの直し（しおりえ(制作補助2)、2026-10-11 企画運営の指摘）
 * 1. 名護屋城跡「およそ420年前に」は年が進むとずれるので、年を書かない言い方に
 * 2. 波戸岬「夕方には海に沈む夕日も美しい場所です」は、16:30 に岬を出る旅なので「夕日の眺めでも知られます」に
 * 3. 呼子朝市「干物は店ごとに作り方が違うので」を出典（あそぼーさが「手作りのため店によって味が異なります」）に合わせる
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-220d-d0a83d9f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "d0a83d9f-65f0-4364-aeb0-4a5310b9e7b0";
const COMMIT = process.argv.includes("--commit");
const REP: [string, string, string][] = [
  ["特別史跡名護屋城跡", "天下を統一した豊臣秀吉が、およそ420年前にこの地に築かせた城の跡で、", "天下を統一した豊臣秀吉が、この地に築かせた城の跡で、"],
  ["波戸岬", "目の前に玄界灘が広がり、夕方には海に沈む夕日も美しい場所です。", "目の前に玄界灘が広がり、夕日の眺めでも知られます。"],
  ["呼子朝市", "干物は店ごとに作り方が違うので、味見をしながら選ぶのも楽しみです。", "干物は店ごとに手作りで味が違うので、味見をしながら選ぶのも楽しみです。"],
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

/**
 * #408 10bda65e の追いの修正（しおりえ(制作補助2)、法務の指摘）
 * - 「最初の」の言い切りを3か所ぼかす（説明文1か所、ショー記念礼拝堂のメモ2か所）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-408b-10bda65e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "10bda65e-3efd-42e7-97dc-9f862e83b9b6";
const COMMIT = process.argv.includes("--commit");
const D_OLD = "軽井沢で最初の教会・ショー記念礼拝堂と、";
const D_NEW = "軽井沢で最初の教会とされるショー記念礼拝堂と、";
const M = [
  ["明治28年（1895年）に造られた軽井沢で最初の教会です。", "明治28年（1895年）に造られた、軽井沢で最初の教会とされる礼拝堂です。"],
  ["ショーが明治21年（1888年）に建てた軽井沢で最初の別荘を復元したもので、", "ショーが明治21年（1888年）に建てた、軽井沢で最初の別荘といわれる建物を復元したもので、"],
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  if (!it.description?.includes(D_OLD)) throw new Error("説明文が想定と違います");
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "軽井沢ショー記念礼拝堂" });
  let memo = s.memo ?? "";
  for (const [o, n] of M) {
    if (!memo.includes(o)) throw new Error(`本文が想定と違います: ${o}`);
    memo = memo.replace(o, n);
  }
  console.log(it.description.replace(D_OLD, D_NEW) + "\n\n" + memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: it.description!.replace(D_OLD, D_NEW) } });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

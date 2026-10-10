/**
 * #454 d686aaf2 の直し（しおりえ(制作補助2)、企画運営の指摘 9/30 17:34・決まり9: 毎年の行事の日にちは月・季節まで）
 *   稲佐の浜「旧暦10月10日に」→「旧暦の10月（今の暦ではおおむね11月ごろ）に」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-454c-d686aaf2.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "d686aaf2-9cd1-4c2a-a27f-87e042f9d717";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "稲佐の浜" });
  const from = "旧暦10月10日に、全国の八百万の神々をお迎えする場所としても知られています。";
  const to = "旧暦の10月（今の暦ではおおむね11月ごろ）に、全国の八百万の神々をお迎えする場所としても知られています。";
  if (!(spot.memo ?? "").includes(from)) throw new Error("本文が想定と違います");
  const memo = (spot.memo ?? "").replace(from, to);
  console.log(`稲佐の浜: …${to}…`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: spot.id }, { memo });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

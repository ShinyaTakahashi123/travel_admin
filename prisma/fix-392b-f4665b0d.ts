/**
 * #392 f4665b0d の追いの修正（しおりえ(制作補助2)、企画運営の指摘）
 * - 泊港 北岸: 開いて確かめていない「とまりんから歩いて7〜8分」を外す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-392b-f4665b0d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "f4665b0d-7529-416b-b259-398d83c1b3c1";
const COMMIT = process.argv.includes("--commit");
const OLD = "高速船の乗り場は泊港の北岸で、旅客ターミナルビル「とまりん」から歩いて7〜8分ほど離れているので、時間に余裕をもって向かいましょう。";
const NEW = "泊港北岸の高速船乗り場から乗るので、時間に余裕をもって向かいましょう。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "泊港 北岸（高速船乗り場）" });
  if (!s.memo?.includes(OLD)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(OLD, NEW);
  console.log(memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { memo });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

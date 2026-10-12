/**
 * #219 d07a1c50 の追いの直し（しおりえ(制作補助2)、2026-10-11 法務の指摘）
 * 白谷雲水峡に、野生動物（ヤクザル・ヤクシカ）への一文と、運転中の飛び出しの一文を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-219c-d07a1c50.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "d07a1c50-be6b-4572-952d-a25feeebf78d";
const FROM = "雨具と歩きやすい靴を用意し、天気を確かめて出かけましょう。";
const TO = FROM + "森や島の道ではヤクザルやヤクシカに出会うことがありますが、エサをあげたり近づきすぎたりせず、車の運転中は動物の飛び出しにも気をつけましょう。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "白谷雲水峡" });
  if (!s.memo?.endsWith(FROM)) throw new Error("本文が想定と違います");
  console.log(`…${TO}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "白谷雲水峡" }, { memo: s.memo.replace(FROM, TO) });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

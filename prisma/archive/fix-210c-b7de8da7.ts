/**
 * #210 b7de8da7 の追いの直し（しおりえ(制作補助2)、2026-10-01 法務の指摘）
 * 二年坂・産寧坂（重要伝統的建造物群保存地区の町並み）に、暮らしへの配慮の一文を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-210c-b7de8da7.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "b7de8da7-4621-4e87-bc5c-38071741fcba";
const FROM = "石段は混み合うので、足元に気をつけましょう。";
const TO = "今も人が暮らし、商いが営まれている町並みですので、静かに歩きましょう。" + FROM;
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "二年坂・産寧坂" });
  if (!s.memo?.endsWith(FROM)) throw new Error("本文が想定と違います");
  console.log(`→ ${s.memo.replace(FROM, TO)}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "二年坂・産寧坂" }, { memo: s.memo.replace(FROM, TO) });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

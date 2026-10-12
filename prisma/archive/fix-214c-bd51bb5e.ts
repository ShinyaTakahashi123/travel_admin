/**
 * #214 bd51bb5e の追いの直し（しおりえ(制作補助2)、2026-10-01 法務の指摘）
 * 新勝寺「祈りの最後の日に乱が収まったことから」を伝聞（〜と伝えられ）に（#212 箱根神社と同じ考え方）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-214c-bd51bb5e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "bd51bb5e-0c5c-4b1e-98de-c6a125a64de5";
const FROM = "祈りの最後の日に乱が収まったことから、以来";
const TO = "祈りの最後の日に乱が収まったと伝えられ、以来";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "成田山新勝寺" });
  if (!s.memo?.includes(FROM)) throw new Error("本文が想定と違います");
  console.log(`${FROM} → ${TO}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "成田山新勝寺" }, { memo: s.memo.replace(FROM, TO) });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

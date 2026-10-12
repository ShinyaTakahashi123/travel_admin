/**
 * #405 0b3b850e の追いの修正その2（しおりえ(制作補助2)、企画運営の指摘）
 * - お台場海浜公園: 水辺の安全の一言を足す（公式Q&A「お台場海浜公園は遊泳禁止となっています」 https://www.tptc.co.jp/park/01_02/qa ）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-405c-0b3b850e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "0b3b850e-f174-49fe-8413-158011680085";
const COMMIT = process.argv.includes("--commit");
const OLD = "夕暮れや夜景の美しさでも知られています。";
const NEW = "夕暮れや夜景の美しさでも知られています。お台場海浜公園は遊泳禁止なので、海には入らず、砂浜から眺めを楽しみましょう。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "お台場海浜公園" });
  if (!s.memo?.includes(OLD)) throw new Error("本文が想定と違います");
  console.log(NEW);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { memo: s.memo.replace(OLD, NEW) });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #392 f4665b0d の追いの修正その2（しおりえ(制作補助2)、法務の任意の提案）
 * - 泊港 北岸: 予約の受付の決まりは変わることがあるので「公式の案内で確かめて」の形にする
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-392c-f4665b0d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "f4665b0d-7529-416b-b259-398d83c1b3c1";
const COMMIT = process.argv.includes("--commit");
const OLD = "予約は1か月前から受け付けています。";
const NEW = "予約の受付は公式の案内で確かめてください。";

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

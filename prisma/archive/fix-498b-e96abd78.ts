/**
 * #498 e96abd78 の追いの直し（しおりえ(制作補助2)、2026-10-01 自分の確かめ: itinerary-audit）
 * - 堺町通り: 芸術村から約0.3kmなので、歩きを15分→5分に（水増しにしない）。着く時刻を 15:25 に、滞在を65分（〜16:30）に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-498b-e96abd78.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "e96abd78-1c28-4825-93b1-9a57aa9538b9";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "堺町通り" });
  if (s.transitDurationMin !== 15 || s.stayDurationMin !== 60) throw new Error("想定と違います");
  const memo = s.memo?.replace("芸術村から歩いて、運河の南東の堺町通りへ。", "芸術村から歩いてすぐ、運河の南東の堺町通りへ。");
  if (memo === s.memo) throw new Error("本文が想定と違います");
  const data = { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 25)), stayDurationMin: 65, transitDurationMin: 5, memo };
  console.log("15:25-16:30 walk/5", memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, data);
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

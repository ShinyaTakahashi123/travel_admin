/**
 * #210 b7de8da7 の追いの直し（しおりえ(制作補助2)、2026-10-01 企画運営の指摘「タクシーは理由を書く」）
 * 高台寺の書き出しに、タクシーにする理由を足す。
 *   出典: 泉涌寺 https://mitera.org/guide/ （市バス「泉涌寺道」から徒歩15分）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-210b-b7de8da7.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "b7de8da7-4621-4e87-bc5c-38071741fcba";
const FROM = "泉涌寺からタクシーで約15分、東山へ。";
const TO = "泉涌寺は、いちばん近いバス停からも坂道を歩いて約15分かかる山あいにあるので、ここからはタクシーで約15分、東山へ。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "高台寺" });
  if (!s.memo?.startsWith(FROM)) throw new Error("本文が想定と違います");
  console.log(`${FROM}\n→ ${TO}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "高台寺" }, { memo: s.memo.replace(FROM, TO) });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

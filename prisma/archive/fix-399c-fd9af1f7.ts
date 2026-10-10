/**
 * #399 fd9af1f7 の追いの修正その2（しおりえ(制作補助2)、法務の任意の提案）
 * - 尖閣湾揚島遊園: 展望台は崖の上なので「柵の外には出ないようにしましょう」を足す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-399c-fd9af1f7.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "fd9af1f7-8f27-4e9a-ab8c-31619adeb036";
const COMMIT = process.argv.includes("--commit");
const OLD = "入り組んだ海岸の景色を一望できます。";
const NEW = "入り組んだ海岸の景色を一望できます。展望台は崖の上にあるので、柵の外には出ないようにしましょう。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "尖閣湾揚島遊園（昼食）" });
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

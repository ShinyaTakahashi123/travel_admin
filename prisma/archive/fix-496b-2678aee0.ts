/**
 * #496 2678aee0 の追いの直し（しおりえ(制作補助2)、2026-10-01 法務の指摘）
 * - 今帰仁城跡: 城跡の中には今も拝まれている御嶽（拝所）があるので、祈りの一文（法務の文例どおり）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-496b-2678aee0.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "2678aee0-3924-4922-9b0d-c0a7608729f2";
const COMMIT = process.argv.includes("--commit");
const O = "城壁の上や石段では足元に気をつけましょう。";
const N = "城跡の中には今も祈りが続く拝所があるので、静かに、敬意をもって見学しましょう。城壁の上や石段では足元に気をつけましょう。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "今帰仁城跡" });
  if (!s.memo?.includes(O)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(O, N);
  console.log(memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: s.id }, { memo });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #407 0df57d67 の追いの修正（しおりえ(制作補助2)、企画運営の指摘）
 * - 一目八景の滞在を90分から60分に（展望台で岩峰を眺め、遊歩道を少し歩く長さ）。終わりは16:00
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-407b-0df57d67.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "0df57d67-3dc2-4af0-8b22-74933cfcc298";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "一目八景" });
  if (s.stayDurationMin !== 90) throw new Error("滞在時間が想定と違います");
  console.log(`${s.name}: 滞在 ${s.stayDurationMin}分 → 60分`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { stayDurationMin: 60 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

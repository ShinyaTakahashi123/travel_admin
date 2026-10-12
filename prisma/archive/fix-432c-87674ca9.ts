/**
 * #432 87674ca9 の追いの修正（しおりえ(制作補助2)、企画運営の6つの確認の4）: 1日目の最初に、車の旅であることを書く
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-432c-87674ca9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "87674ca9-f370-4383-9108-f19d9f510274";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "天の岩戸" });
  const from = "旅の始まりは、日本神話ゆかりの地として知られる天の岩戸へ。";
  if (!s.memo?.includes(from)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(from, "この旅は車（レンタカーなど）でめぐります。旅の始まりは、日本神話ゆかりの地として知られる天の岩戸へ。");
  console.log(memo.slice(0, 120));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

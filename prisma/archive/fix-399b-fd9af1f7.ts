/**
 * #399 fd9af1f7 の追いの修正（しおりえ(制作補助2)、監査の「言い切り?」への対応）
 * - 北沢浮遊選鉱場跡: 「日本で初めて実用化に成功しました」→「日本で初めて実用化に成功したとされています」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-399b-fd9af1f7.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "fd9af1f7-8f27-4e9a-ab8c-31619adeb036";
const COMMIT = process.argv.includes("--commit");
const OLD = "日本で初めて実用化に成功しました。";
const NEW = "日本で初めて実用化に成功したとされています。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "北沢浮遊選鉱場跡" });
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

/**
 * #390 eebd52df の追いの修正その2（しおりえ(制作補助2)、企画運営の指摘）
 * - CoCoLo湯沢: お酒の一文に「お酒は20歳から」を入れ、運転する人への呼びかけを強める
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-390c-eebd52df.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "eebd52df-4af9-478e-9f67-95784b9af2d2";
const COMMIT = process.argv.includes("--commit");

const OLD = "お酒を飲むときは飲みすぎに気をつけ、車を運転する人は飲まないようにしましょう。";
const NEW = "お酒は20歳から。飲みすぎに気をつけ、車を運転する人は飲まないでください。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "CoCoLo湯沢" });
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

/**
 * #391 f3c75865 の追いの修正（しおりえ(制作補助2)、監査の「言い切り?」への対応）
 * - 八甲田丸: 「最も長い23年7か月にわたって運航されました」→「…運航されたといわれます」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-391b-f3c75865.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "f3c75865-519e-4488-8677-d4d9a3b45ec5";
const COMMIT = process.argv.includes("--commit");
const OLD = "歴代の青函連絡船の中で最も長い23年7か月にわたって運航されました。";
const NEW = "歴代の青函連絡船の中で最も長い、23年7か月にわたって運航されたといわれます。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "青函連絡船メモリアルシップ八甲田丸" });
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

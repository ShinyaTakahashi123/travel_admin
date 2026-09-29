/**
 * #422 58c64d69 の追いの修正その2（しおりえ(制作補助2)、企画運営の指摘）
 * - 飯盛山: 墓所へ上る石段は急なので、安全の一言を足す（会津若松観光ナビに「飯盛山スロープコンベア」の案内あり https://www.aizukanko.com/course/787 の関連ページ一覧）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-422c-58c64d69.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "58c64d69-20fc-4509-912f-a99098a6d0fe";
const COMMIT = process.argv.includes("--commit");
const OLD = "武家屋敷から車で約20分。";
const NEW = "武家屋敷から車で約20分。墓所へは急な石段を上るので、足元に気をつけて歩きましょう（石段のわきにはスロープコンベアもあります）。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "飯盛山（白虎隊十九士の墓）" });
  if (!s.memo?.startsWith(OLD)) throw new Error("本文が想定と違います");
  console.log(s.memo.replace(OLD, NEW));
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

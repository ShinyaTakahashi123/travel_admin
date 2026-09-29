/**
 * #396 f6f7102e の追いの修正（しおりえ(制作補助2)、企画運営の指摘）
 * - 福井市中央公園: 資料を開いて確かめていない「2018年に全体が完成し、」を外す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-396b-f6f7102e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "f6f7102e-84e3-426b-9fc7-2fe28a34481e";
const COMMIT = process.argv.includes("--commit");
const OLD = "2018年に全体が完成し、堀割広場やビジターセンター、広い芝生があり、";
const NEW = "堀割広場やビジターセンター、広い芝生があり、";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "福井市中央公園" });
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

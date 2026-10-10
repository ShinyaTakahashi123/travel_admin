/**
 * #206 acb93a0f 姫塚公園の時刻の直し（しおりえ(制作補助2)、2026-10-01 itinerary-audit「時刻の計算が合わない」）
 * - 県民の森 16:05 まで＋車20分なので、姫塚公園を 16:25〜16:55 に（206b では 16:15 にしていた）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-206c-acb93a0f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "acb93a0f-4b8d-457d-ac3b-f513903aed43";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "姫塚公園" });
  if (s.visitTime?.getUTCHours() !== 16 || s.visitTime.getUTCMinutes() !== 15) throw new Error("時刻が想定と違います");
  if (!COMMIT) return console.log("16:15 → 16:25\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 16, 25)) });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

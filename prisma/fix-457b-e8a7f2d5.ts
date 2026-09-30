/**
 * #457 e8a7f2d5 の時間の直し（しおりえ(制作補助2)、itinerary-audit の指摘: 茶道美術館→足羽神社 0.2km に歩き15分は長い）
 *   愛宕坂の145段を上る道なので、歩き10分・足羽神社 14:25〜15:05（40分。境内の枝垂れ桜やタカオモミジを見る時間）に。足羽山公園は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-457b-e8a7f2d5.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "e8a7f2d5-3e1a-4547-baeb-7021060f1fce";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "足羽神社" });
  console.log("足羽神社: 歩き10分 14:25〜15:05");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: spot.id }, { visitTime: t(14, 25), stayDurationMin: 40, transitDurationMin: 10 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

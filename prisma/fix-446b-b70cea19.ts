/**
 * #446 b70cea19 の時間の直し（しおりえ(制作補助2)、itinerary-audit の指摘: 百尺観音→日本寺 0.3km に歩き30分は長すぎ）
 *   日本寺: 歩き10分・10:35〜11:40（65分。羅漢・大仏広場・中腹・仁王門と、広い境内を下りながらめぐる時間を含む）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-446b-b70cea19.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "b70cea19-5343-44a7-b398-e534425c1827";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const spot = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "日本寺（鋸山）" });
  console.log("日本寺: 歩き10分 10:35〜11:40");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: spot.id }, { visitTime: t(10, 35), stayDurationMin: 65, transitDurationMin: 10 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

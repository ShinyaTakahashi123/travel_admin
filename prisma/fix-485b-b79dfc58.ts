/**
 * #485 b79dfc58 の追いの直し（しおりえ(制作補助2)、itinerary-audit の指摘）
 *   城への歩き: 城下町プラザから徒歩約20分（ https://hachiman-castle.com/access/ ）で、旧庁舎記念館からはその少し先なので25分に（まっすぐの距離は短いが山道）。城 13:40〜14:55
 *   八幡神社 15:10〜15:45（城から山道を下りて15分）、城下町プラザ 15:55〜16:30
 *   城下町プラザ: 「無料の休憩所」は料金の言い方なので「休憩所」に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-485b-b79dfc58.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "b79dfc58-26a7-4cbc-b1f2-b089a25ace29";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const castle = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "郡上八幡城" });
  const shrine = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "八幡神社" });
  const plaza = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "郡上八幡城下町プラザ" });
  const cm = (castle.memo ?? "").replace("旧庁舎記念館から山道を上って、郡上八幡城へ。", "旧庁舎記念館から山道を歩いて約25分、郡上八幡城へ。");
  const pm = (plaza.memo ?? "").replace("無料の休憩所", "休憩所");
  if (cm === castle.memo || pm === plaza.memo) throw new Error("本文が想定と違います");
  console.log(cm.slice(0, 40), "／", pm.slice(0, 70));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: castle.id }, { visitTime: t(13, 40), stayDurationMin: 75, transitDurationMin: 25, memo: cm }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: shrine.id }, { visitTime: t(15, 10), stayDurationMin: 35 }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: plaza.id }, { visitTime: t(15, 55), stayDurationMin: 35, memo: pm }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

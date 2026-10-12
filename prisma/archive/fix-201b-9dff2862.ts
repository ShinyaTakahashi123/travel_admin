/**
 * #201 9dff2862 の追いの直し（しおりえ(制作補助2)、2026-10-01 自分の確かめ: itinerary-audit・prayer-check）
 * - 鍋倉公園: 博物館のすぐ裏（OSM で約0.1km）なので、車10分ではなく歩いて約5分に。三の丸・南部神社へ歩いて上がる分、滞在を40分に（11:40〜12:20）
 * - めがね橋: 線路と道路のそばなので、決められた場所から眺める一文
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-201b-9dff2862.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "9dff2862-bb91-4d25-847e-62f2267f18de";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const n = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "鍋倉公園（鍋倉城址）" });
  const O1 = "博物館から車で鍋倉山へ。";
  if (!n.memo?.includes(O1) || n.transitMode !== "car") throw new Error("鍋倉公園が想定と違います");
  const nMemo = n.memo.replace(O1, "博物館のすぐ裏の鍋倉山へ、歩いて上がります。");
  const m = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "めがね橋（宮守川橋梁）" });
  const O2 = "見学のあとは、車で遠野駅へ";
  if (!m.memo?.includes(O2)) throw new Error("めがね橋が想定と違います");
  const mMemo = m.memo.replace(O2, "線路や道路に近づかず、決められた場所から眺めましょう。" + O2);
  console.log(`鍋倉公園 11:40-12:20 walk/5: ${nMemo}\n\nめがね橋: ${mMemo}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: n.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 11, 40)), stayDurationMin: 40, transitMode: "walk", transitDurationMin: 5, memo: nMemo }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: m.id }, { memo: mMemo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

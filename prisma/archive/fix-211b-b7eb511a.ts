/**
 * #211 b7eb511a の追いの直し（しおりえ(制作補助2)、自分で見直して気づいた点）
 * 1日目は福江港ターミナルに車を停めて城跡・資料館・美術館を歩くので、明星院へは、ターミナルに歩いて戻ってから車で向かう形にする
 *   山本二三美術館 14:55〜15:45（50分）→（歩いて約15分でターミナルへ戻り、車で約10分）明星院 16:10〜16:50（17時まで）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-211b-b7eb511a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "b7eb511a-4379-407d-bf5e-dcaeb252229c";
const FROM = "美術館から車で約15分。";
const TO = "美術館から福江港ターミナルの駐車場へ歩いて約15分で戻り、車で約10分（あわせて約25分）。";
const T_FROM = "中には飲食店や土産店、観光案内所があり、";
const T_TO = "このあとは車をここに停めたまま、城跡や資料館を歩いてめぐります。中には飲食店や土産店、観光案内所があり、";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const myo = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "明星院" });
  const term = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "福江港ターミナル" });
  const yama = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "山本二三美術館" });
  if (!myo.memo?.startsWith(FROM) || !term.memo?.includes(T_FROM) || yama.stayDurationMin !== 55) throw new Error("想定と違います");
  console.log("山本二三美術館 14:55〜15:45 / 明星院 16:10〜16:50（移動25分）\n" + myo.memo.replace(FROM, TO).slice(0, 60) + "…\n" + term.memo.replace(T_FROM, T_TO));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "福江港ターミナル" }, { memo: term.memo!.replace(T_FROM, T_TO) }, { tx });
      await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "山本二三美術館" }, { stayDurationMin: 50 }, { tx });
      await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "明星院" }, { visitTime: t(16, 10), transitDurationMin: 25, memo: myo.memo!.replace(FROM, TO) }, { tx });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

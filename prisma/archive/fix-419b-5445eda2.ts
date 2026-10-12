/**
 * #419 5445eda2 の追いの修正（しおりえ(制作補助2)、自分の点検で）
 * - 氷川参道: 参道の点（中ほど）まで神社から歩いて約20分なので、移動を20分・12:40〜13:10 に。本文の書き出しも合わせる
 * - 鉄道博物館: 13:35〜16:05 の150分に（昼食込み）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-419b-5445eda2.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "5445eda2-d558-41e6-96ff-7a0987c42d2b";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const OLD = "神社から南へ続く参道で、";
const NEW = "神社から南へ、ケヤキ並木の中を歩いて約20分。";
const OLD2 = "中山道から約2kmの長さがあり、両側に美しいケヤキ並木が続きます。";
const NEW2 = "氷川神社の参道は中山道から約2kmの長さがあり、両側に美しいケヤキ並木が続きます。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "氷川参道" });
  const r = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "鉄道博物館（昼食）" });
  if (!s.memo?.includes(OLD) || !s.memo.includes(OLD2)) throw new Error("参道の本文が想定と違います");
  const memo = s.memo.replace(OLD, NEW).replace(OLD2, NEW2);
  console.log(memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { memo, transitDurationMin: 20, visitTime: t(12, 40) }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: r.id }, { visitTime: t(13, 35), stayDurationMin: 150 }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #206 acb93a0f たつこ像の座標の出どころを揃える（しおりえ(制作補助2)、2026-10-01 法務の質問）
 * - 206e の 39.7135942,140.6343148 は、駐車場 way 1547373509 の角の点を自分で平均した値だった（OSM の点そのものではない）
 * - ほかのスポットと同じく、Nominatim が返す同じ way の中心点 39.7136016,140.6343054 に直す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-206f-acb93a0f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "acb93a0f-4b8d-457d-ac3b-f513903aed43";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "たつこ像" });
  if (Math.abs(Number(s.lat) - 39.7135942) > 1e-5 || Math.abs(Number(s.lng) - 140.6343148) > 1e-5) throw new Error("座標が想定と違います");
  if (!COMMIT) return console.log(`(${s.lat},${s.lng}) → (39.7136016,140.6343054)\n確認モードです。--commit で書き込みます。`);
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: s.id }, { lat: 39.7136016, lng: 140.6343054 });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

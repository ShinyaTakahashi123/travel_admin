/**
 * #204 ac272e0b の追いの直し（しおりえ(制作補助2)、2026-10-01 企画運営の指摘）
 * 1. 鳴門市ドイツ館「1918年6月1日」は日付なので「1918年」までに
 * 2. 道の駅くるくる なるとの座標: OSM の地名（大字）の点ではなく、OSM の生の API で見つけた道の駅の敷地
 *    way 1037497928（highway=services, name=道の駅くるくる なると, website=kurukurunaruto.com）の中心 34.1584928,134.5796644 に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-204b-ac272e0b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "ac272e0b-8781-4d47-ad7b-3112e9c6bd53";
const COMMIT = process.argv.includes("--commit");
const O = "1918年6月1日には、";
const N = "1918年には、";

async function main() {
  const d = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "鳴門市ドイツ館" });
  if (!d.memo?.includes(O)) throw new Error("ドイツ館の本文が想定と違います");
  const k = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "道の駅くるくる なると" });
  if (Number(k.lat) !== 34.1614276 || Number(k.lng) !== 134.5786142) throw new Error("くるくる なるとの座標が想定と違います");
  console.log(`ドイツ館: ${O} → ${N}\nくるくる なると: (${k.lat},${k.lng}) → (34.1584928,134.5796644)`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: d.id }, { memo: d.memo!.replace(O, N) }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: k.id }, { lat: 34.1584928, lng: 134.5796644 }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

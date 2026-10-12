/**
 * #201 9dff2862 の続き（しおりえ(制作補助2)）: 法務の指摘。福泉寺の座標（39.371577,141.563128）は OSM のバス停 node 5947837785「福泉寺」（highway=bus_stop）の点だった
 *   OSM にお寺の点がない（まわりの生データで確かめた）ので、国土地理院の地名・施設名の点「福泉寺」（dataSource 1）39.3751165,141.5636341 にする。本文は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-201f-9dff2862.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "9dff2862";
const SPOT_ID = "952cd74b-0f56-435b-86a8-1b8c6f915ca7";
const TO = { lat: 39.3751165, lng: 141.5636341 };
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: SPOT_ID }, include: { day: true } });
  if (s.name !== "福泉寺" || !s.day.itineraryId.startsWith(ITINERARY_ID)) throw new Error(`想定と違います ${s.name}`);
  console.log(`福泉寺 ${s.lat},${s.lng} → ${TO.lat},${TO.lng}`);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: SPOT_ID }, data: TO });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

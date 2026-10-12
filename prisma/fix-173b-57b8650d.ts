/**
 * #173 57b8650d の続き（しおりえ(制作補助2)）: 法務の確認（2026-10-11 15:55、記録 86427bc）の2点を直す
 *   ① 写真: 下呂発温泉博物館のスポットの写真（663highland の 260125_Gero_Onsen…01s3.jpg）は、飛騨川の河原から見た雪の温泉街の景色なので、「下呂の温泉街（昼食）」へ移す
 *      （表紙の写真は同じ写真のまま）
 *   ② 座標: 下呂の温泉街（昼食）→ 共同浴場「白鷺の湯」way 714665465（Nominatim の中心。法務の挙げた n5106872058 は駐車場の点なので、浴場の建物の中心にした）
 *            温泉寺 → 寺そのものの n7125611132「醫王霊山 温泉寺」（place_of_worship、API で名前つき）
 *      金山の町の点は、飲食店の点 n6175364389 ではなく「筋骨めぐり」の n5144311521（35.6610545, 137.1559925、name=筋骨めぐり tourism=yes）なので変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-173b-57b8650d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "57b8650d-ffaa-435b-81d7-27085573a508";
const MUSEUM = "3f52b08a-4f3b-4f15-836a-4e95109d879c";
const PHOTO = "77d695c0-b9d2-46a8-9f03-2da080564feb";
const COMMIT = process.argv.includes("--commit");

const COORDS: { name: string; lat: number; lng: number }[] = [
  { name: "下呂の温泉街（昼食）", lat: 35.8093187, lng: 137.2414312 },
  { name: "温泉寺", lat: 35.8105925, lng: 137.2429277 },
];

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID } }, select: { id: true, name: true, lat: true, lng: true } });
  const photo = await prisma.photo.findUniqueOrThrow({ where: { id: PHOTO } });
  if (photo.spotId !== MUSEUM) throw new Error("写真の付き先が想定と違います");
  const lunch = spots.filter((s) => s.name === COORDS[0].name);
  if (lunch.length !== 1) throw new Error("昼食のスポットが1つではありません");
  const plan = COORDS.map((c) => {
    const hit = spots.filter((s) => s.name === c.name);
    if (hit.length !== 1) throw new Error(`${c.name} が1つではありません`);
    console.log(`${c.name}: (${hit[0].lat}, ${hit[0].lng}) → (${c.lat}, ${c.lng})`);
    return { id: hit[0].id, lat: c.lat, lng: c.lng };
  });
  console.log(`写真 ${PHOTO.slice(0, 8)}: 博物館 → ${COORDS[0].name}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const p of plan) await tx.spot.update({ where: { id: p.id }, data: { lat: p.lat, lng: p.lng } });
    await tx.photo.update({ where: { id: PHOTO }, data: { spotId: lunch[0].id } });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

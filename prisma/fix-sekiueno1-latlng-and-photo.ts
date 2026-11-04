/**
 * 関宿＋伊賀上野(地方のしおり候補6、30eed95e)の登録後の直し。
 * 1. 13か所すべて、緯度と経度が逆に登録されていた(seedのfallbackLatLngを[経度,緯度]の順で
 *    書いていたため。法務の指摘2026-11-03)。seed-local-sekiueno1.ts は [緯度,経度] の順に
 *    直し済み。本番の13行のlat/lngを、正しい値(緯度34度台・経度136度台)に入れかえる。
 * 2. だんじり会館の写真(File:Ueno-Tenzin_festival.JPG)を外す。会館の建物でなく、実際の
 *    上野天神祭の街頭の写真で、「その場所の写真」になっていないため(企画運営の指示2026-11-03)。
 *    写真の控え(photo-cache.json・photo-credit-cache.json)の該当キーも消す。
 * 使い方: npm run prod -- npx tsx prisma/fix-sekiueno1-latlng-and-photo.ts [--commit]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "../src/lib/prisma";

const TITLE = "東海道関宿の町並みと伊賀上野城、二つの城下町をめぐる日帰りプラン";
const DANJIRI_SPOT_NAME = "だんじり会館";
const CACHE_KEY = "だんじり会館";

async function main() {
  const commit = process.argv.includes("--commit");
  const it = await prisma.itinerary.findFirstOrThrow({ where: { title: TITLE } });
  const day = await prisma.day.findFirstOrThrow({
    where: { itineraryId: it.id },
    include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } },
  });

  console.log("【1. 緯度・経度の入れかえ】");
  const updates: { id: string; name: string; oldLat: number; oldLng: number; newLat: number; newLng: number }[] = [];
  for (const s of day.spots) {
    if (s.lat === null || s.lng === null) throw new Error(`${s.name}: 現在の点がnullです`);
    const oldLat = Number(s.lat);
    const oldLng = Number(s.lng);
    const newLat = oldLng; // 入れかえ
    const newLng = oldLat;
    updates.push({ id: s.id, name: s.name, oldLat, oldLng, newLat, newLng });
    console.log(
      `  [${s.orderNo}] ${s.name}: (${oldLat.toFixed(4)},${oldLng.toFixed(4)}) → (${newLat.toFixed(4)},${newLng.toFixed(4)})`,
    );
    if (newLat < 33 || newLat > 36 || newLng < 134 || newLng > 138) {
      throw new Error(`入れかえ後の値が三重県の範囲から外れています: ${s.name}`);
    }
  }

  console.log("\n【2. だんじり会館の写真を外す】");
  const danjiriSpot = day.spots.find((s) => s.name === DANJIRI_SPOT_NAME);
  if (!danjiriSpot) throw new Error("だんじり会館が見つかりません");
  console.log(`  ${DANJIRI_SPOT_NAME} の写真: ${danjiriSpot.photos.length}枚`);
  for (const p of danjiriSpot.photos) console.log(`    削除対象: ${p.url}`);

  const photoCachePath = join(process.cwd(), "prisma", "photo-cache.json");
  const creditCachePath = join(process.cwd(), "prisma", "photo-credit-cache.json");
  const photoCache = JSON.parse(readFileSync(photoCachePath, "utf8"));
  const creditCache = JSON.parse(readFileSync(creditCachePath, "utf8"));
  console.log(`  photo-cache.json の該当キー: ${CACHE_KEY in photoCache ? "あり" : "なし"}`);
  console.log(`  photo-credit-cache.json の該当キー: ${CACHE_KEY in creditCache ? "あり" : "なし"}`);

  if (commit) {
    await prisma.$transaction([
      ...updates.map((u) => prisma.spot.update({ where: { id: u.id }, data: { lat: u.newLat, lng: u.newLng } })),
      prisma.photo.deleteMany({ where: { spotId: danjiriSpot.id } }),
    ]);
    delete photoCache[CACHE_KEY];
    delete creditCache[CACHE_KEY];
    writeFileSync(photoCachePath, JSON.stringify(photoCache));
    writeFileSync(creditCachePath, JSON.stringify(creditCache));
    console.log("\n書き込みました。");
  } else {
    console.log("\n(確認モード。--commit で書き込みます)");
  }
}
main().finally(() => prisma.$disconnect());

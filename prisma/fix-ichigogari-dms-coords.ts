/**
 * いちご狩り #2(伊豆長岡)・#3(館山)・#6(つくば)のDMS座標の直し
 * (法務2026-10-14指摘、コミット19752f68)。
 *
 * - 韮山反射炉: OSM node 2131396854(世界遺産、historic=yes)
 * - 館山城(八犬伝博物館): OSM way 699463376「館山城跡」、Nominatim中心
 * - 那古寺: OSM node 2474925175(amenity=place_of_worship)
 * - 地図と測量の科学館: OSM node 335886120(tourism=museum)
 *
 * 【決まり】対象はすべてidで指定し、更新前にday→itineraryのidが
 * 一致するか確認する。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ichigogari-dms-coords.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ichigogari-dms-coords.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const FIXES = [
  {
    id: "a3ec4c91-70e9-492c-9757-00394b97c78f",
    itineraryId: "0ba3c742-ad3f-41e9-b5a9-164713022713",
    name: "韮山反射炉",
    oldLat: 35.039361,
    oldLng: 138.962028,
    newLat: 35.0396263,
    newLng: 138.9620669,
    source: "OSM node 2131396854",
  },
  {
    id: "a7868fe3-196b-4d4a-b131-40334edc93d0",
    itineraryId: "57126c5e-52ef-4b79-b3ff-1216c57bb7d8",
    name: "館山城（八犬伝博物館）",
    oldLat: 34.981556,
    oldLng: 139.855306,
    newLat: 34.9815215,
    newLng: 139.8557312,
    source: "OSM way 699463376「館山城跡」(Nominatim中心)",
  },
  {
    id: "66011aad-e40c-412d-8034-60723dc1d1dd",
    itineraryId: "57126c5e-52ef-4b79-b3ff-1216c57bb7d8",
    name: "那古寺",
    oldLat: 35.025556,
    oldLng: 139.857972,
    newLat: 35.0255134,
    newLng: 139.8579468,
    source: "OSM node 2474925175",
  },
  {
    id: "c7f6cf3e-a23b-405b-ba22-6a3f8316e6ee",
    itineraryId: "625bdb23-f36e-489d-afd9-e3c8f85041e7",
    name: "地図と測量の科学館",
    oldLat: 36.103972,
    oldLng: 140.085583,
    newLat: 36.1041068,
    newLng: 140.0855345,
    source: "OSM node 335886120",
  },
];

async function assertBelongsTo(spotId: string, itineraryId: string) {
  const spot = await prisma.spot.findUnique({
    where: { id: spotId },
    include: { day: { include: { itinerary: { select: { id: true, title: true } } } } },
  });
  if (!spot) throw new Error(`spot not found: ${spotId}`);
  if (spot.day.itinerary.id !== itineraryId) {
    throw new Error(`対象外のしおりです: spot=${spotId} name=${spot.name} itinerary=${spot.day.itinerary.id}(${spot.day.itinerary.title})`);
  }
  return spot;
}

async function main() {
  for (const f of FIXES) {
    const spot = await assertBelongsTo(f.id, f.itineraryId);
    if (spot.name !== f.name) throw new Error(`名前が想定と違います: ${spot.name} !== ${f.name}`);
    if (Math.abs(Number(spot.lat) - f.oldLat) > 1e-6 || Math.abs(Number(spot.lng) - f.oldLng) > 1e-6) {
      throw new Error(`現在の座標が想定と違います: ${spot.name} lat=${spot.lat} lng=${spot.lng}`);
    }
    console.log(`[確認OK] ${spot.name}(${spot.id}): ${f.oldLat},${f.oldLng} → ${f.newLat},${f.newLng}  [${f.source}]`);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  for (const f of FIXES) {
    await prisma.spot.update({ where: { id: f.id }, data: { lat: f.newLat, lng: f.newLng } });
  }

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());

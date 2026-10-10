/**
 * #204 ac272e0b・#206 acb93a0f の座標の出どころを揃える（しおりえ(制作補助2)、2026-10-01 法務の質問から気づいた）
 * - OSM の生の API から取った way の点を、自分で角の点を平均して入れていた。OSM の点そのものではないので、
 *   Nominatim の lookup（https://nominatim.openstreetmap.org/lookup?osm_ids=W<番号>）が返す中心点に直す（ずれは数m〜数十m）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-204c-206g.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const IT204 = "ac272e0b-8781-4d47-ad7b-3112e9c6bd53";
const IT206 = "acb93a0f-4b8d-457d-ac3b-f513903aed43";
// [しおり, 日, スポット名, way, 緯度, 経度]
const FIX: [string, number, string, number, number, number][] = [
  [IT204, 1, "道の駅くるくる なると", 1037497928, 34.1580797, 134.5798285],
  [IT204, 1, "大鳴門橋架橋記念館エディ", 1104053882, 34.2348881, 134.6401118],
  [IT204, 1, "大麻比古神社", 772422582, 34.170292, 134.5024178],
  [IT204, 1, "霊山寺", 416330224, 34.1594397, 134.5027968],
  [IT204, 2, "鳴門市ドイツ館", 320024675, 34.164694, 134.4990504],
  [IT206, 1, "御座石神社", 837055330, 39.7516093, 140.6504812],
  [IT206, 1, "むらっこ物産館", 279358408, 39.714483, 140.6260933],
  [IT206, 1, "漢槎宮（浮木神社）", 910016132, 39.7137477, 140.6347082],
  [IT206, 1, "思い出の潟分校", 279356305, 39.6969705, 140.6727638],
  [IT206, 1, "県民の森", 737324661, 39.7195254, 140.6959467],
  [IT206, 1, "姫塚公園", 775575411, 39.7249523, 140.7196434],
];

async function main() {
  const plan: { it: string; dn: number; id: string; lat: number; lng: number }[] = [];
  for (const [it, dn, name, way, lat, lng] of FIX) {
    const s = await findSpotInItinerary(it, { dayNumber: dn, spotName: name });
    const d = Math.hypot((Number(s.lat) - lat) * 111000, (Number(s.lng) - lng) * 91000);
    if (d > 200) throw new Error(`${name}: 今の点から離れすぎています（${d.toFixed(0)}m）`);
    console.log(`${name}: (${s.lat},${s.lng}) → way ${way} (${lat},${lng})  ${d.toFixed(0)}m`);
    plan.push({ it, dn, id: s.id, lat, lng });
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const p of plan) await updateSpotInItinerary(p.it, { dayNumber: p.dn, spotId: p.id }, { lat: p.lat, lng: p.lng }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

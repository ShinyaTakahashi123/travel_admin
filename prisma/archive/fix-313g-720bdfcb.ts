/**
 * #313の続き(企画運営の指摘、2026-09-30 19:45 JST)。
 * 有田内山伝統的建造物群の座標を、fix-313cで国土地理院の住所検索
 * (大字「上幸平」の中心点、33.191868,129.901443)に訂正したが、これは
 * 大字の中心のため使えないとの指摘。Nominatimで名称一致した道路
 * 「大木有田線」のうち、表示名が「上幸平二丁目」となっている区間
 * (way id 1110326023、33.1918072,129.9037031。スポットの住所「西松浦郡
 * 有田町上幸平」と同じ大字内の実際の道路の点)を元にした推定に差し替え。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-313g-720bdfcb.ts
 * (実行済み。現在の座標を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "720bdfcb-fba0-4b55-b949-ae25f4ff3bbb";

async function main() {
  const s = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "有田内山伝統的建造物群" },
  });
  await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { lat: 33.1918072, lng: 129.9037031 });
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

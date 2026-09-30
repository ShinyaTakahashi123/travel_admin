/**
 * #315の続き(企画運営の指摘、2026-09-30 20:28 JST)。
 * しおり「大原美術館、日本初とされる西洋美術中心の私立美術館プラン」
 * (73c2a636-6381-4cf5-9f24-f7d344692cc1)
 *
 * 1. 大原美術館: 座標34.596111,133.770556がWikipedia由来の丸い値(度分秒
 *    をそのまま変換したような値)だったため、Nominatimで名称一致した
 *    OSMの建物way(id 616920786、34.5960325,133.7704385)に差し替え。
 * 2. 児島虎次郎記念館: 大原美術館の座標をそのまま使っていたのを訂正。
 *    Overpass(overpass-api.de、building=yesかつnameタグ付きの建物を
 *    美観地区の範囲で検索)で、記念館の建物である「旧中国銀行倉敷本町
 *    出張所」(旧第一合同銀行倉敷支店と同じ建物、way id 332084932、
 *    34.596761,133.7714481)を発見。名称一致するその点に差し替え。
 *
 * itinerary-audit.cjs・flow-check.cjs で座標変更後の徒歩距離・速さを
 * 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-315h-73c2a636.ts
 * (実行済み。現在の座標を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "73c2a636-6381-4cf5-9f24-f7d344692cc1";

async function main() {
  const ohara = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "大原美術館" },
  });
  await updateSpotInItinerary(ITIN_ID, { spotId: ohara.id }, { lat: 34.5960325, lng: 133.7704385 });

  const kojima = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "児島虎次郎記念館" },
  });
  await updateSpotInItinerary(ITIN_ID, { spotId: kojima.id }, { lat: 34.596761, lng: 133.7714481 });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

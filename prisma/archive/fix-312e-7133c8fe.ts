/**
 * #312の続き(企画運営の指摘、2026-09-30 19:15 JST)。
 * しおり「祖谷渓の展望台と落合集落、秘境の絶景と茅葺きの里1泊2日」
 * (7133c8fe-1bb5-4d3f-b644-653c74f59419)
 *
 * 座標の出どころの訂正:
 * - 龍宮崖公園: NAVITIMEの値は使えない(手引きで使えるのはOSM・国土地理院
 *   のみ)ため、裏付けに使ったOSMの「東祖谷の吊橋」way(id 367929118、
 *   33.8610276,133.8780264)そのものに差し替え。
 * - 栗枝渡八幡神社: Wikipediaの座標は単独では使えないため、OSMで神社の
 *   点そのものが見つからなかった代わりに、Nominatimで名称一致した
 *   「国道439号」の道路の点のうち、表示名が「東祖谷栗枝渡」となっている
 *   もの(way id 25521006、33.8817237,133.9276176。Wikipediaの座標から
 *   およそ0.6km)を、神社に最も近い名称一致のOSM点として使用。
 * - 郷土文化保存伝習施設: 京上大橋のOSMの点(隣の点)は例外どおりでOKと
 *   確認済みのため変更なし。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-312e-7133c8fe.ts
 * (実行済み。現在の座標を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "7133c8fe-1bb5-4d3f-b644-653c74f59419";

async function main() {
  const ryugu = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "龍宮崖公園" },
  });
  await updateSpotInItinerary(ITIN_ID, { spotId: ryugu.id }, { lat: 33.8610276, lng: 133.8780264 });

  const kurishido = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "栗枝渡八幡神社" },
  });
  await updateSpotInItinerary(ITIN_ID, { spotId: kurishido.id }, { lat: 33.8817237, lng: 133.9276176 });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

/**
 * #106 6ba2fc04の直し(2回目)。企画運営(2026-10-01 13:25)の指摘:
 * 加悦椿文化資料館の座標に、GSI住所検索の大字レベルの中心点を使って
 * いたのは不可。OSM生APIで、建物・駐車場などの実在の点を探したが、
 * この住所(与謝野町字滝1986)周辺はOSMの建物データが非常に少なく、
 * 該当する建物・施設の点は見つからなかった。bbox 135.045-135.080,
 * 35.460-35.485 の範囲で、名前つきのノードのうち最も近かったのは
 * 「奥滝」(集落の地名、node、35.4790523,135.0622058)で、元のGSI点
 * から約0.74km。これをすぐそばの実在のOSM点として採用する。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6ba2fc04%'`);
  const itinId = rows[0].id;
  const tsubaki = await findSpotInItinerary(itinId, { spotName: "加悦椿文化資料館" });

  if (Number(tsubaki.lat) !== 35.472462 || Number(tsubaki.lng) !== 135.060715) throw new Error("現在の座標が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: tsubaki.id }, { lat: 35.4790523, lng: 135.0622058 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

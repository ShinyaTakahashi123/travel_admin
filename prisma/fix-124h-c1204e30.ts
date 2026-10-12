/**
 * #124 c1204e30の直し(8回目)。法務(2026-10-11、記録6723c45)の指摘:
 * 金融資料館の座標43.1963,141.0003は4けたに丸めた数字(OSM node
 * 462763241「金融資料館」から約4m)。OSMの点そのもの(43.196270,
 * 141.000325)に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c1204e30%'`);
  const itinId = rows[0].id;
  const kinyu = await findSpotInItinerary(itinId, { spotName: "日本銀行旧小樽支店金融資料館" });

  console.log("確認OK。現在の座標:", kinyu.lat, kinyu.lng);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: kinyu.id }, { lat: 43.19627, lng: 141.000325 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

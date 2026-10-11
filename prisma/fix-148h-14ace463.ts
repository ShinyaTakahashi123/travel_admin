/**
 * #148 14ace463の直し(8回目)。法務の指摘: 福泉寺の座標39.371577,141.563128は
 * バス停n5947837785「福泉寺」(highway=bus_stop)の点で、9dff2862から写した
 * 座標がそもそも誤りだった。国土地理院の施設名の点「福泉寺」39.3751165,
 * 141.5636341に直す。距離が変わるため、遠野郷八幡宮→福泉寺の移動を9分→10分に
 * 修正し、以降のvisitTimeを1分ずつ後ろにずらす。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '14ace463%'`);
  const itinId = rows[0].id;
  const fukusenji = await findSpotInItinerary(itinId, { spotName: "福泉寺" });
  const tsuzuki = await findSpotInItinerary(itinId, { spotName: "続石" });

  if (Number(fukusenji.lat) !== 39.371577) throw new Error("福泉寺の座標が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({
      where: { id: fukusenji.id },
      data: {
        lat: 39.3751165,
        lng: 141.5636341,
        visitTime: t(14, 18),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10 }] },
      },
    }),
    prisma.spot.update({ where: { id: tsuzuki.id }, data: { visitTime: t(15, 18) } }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

/**
 * #148 14ace463の直し(10回目、企画運営の指摘)。福泉寺の書き出し
 * 「遠野郷八幡宮から車でおよそ9分」が、実際の移動(10分)と食い違っていた。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "遠野郷八幡宮から車でおよそ9分、福泉寺に着きます。";
const TO = "遠野郷八幡宮から車でおよそ10分、福泉寺に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '14ace463%'`);
  const itinId = rows[0].id;
  const fukusenji = await findSpotInItinerary(itinId, { spotName: "福泉寺" });

  if (!fukusenji.memo?.includes(FROM)) throw new Error("福泉寺の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: fukusenji.id }, data: { memo: fukusenji.memo!.replace(FROM, TO) } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

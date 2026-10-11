/**
 * #149 158f73faの直し(3回目)。企画運営の指摘。森八幡神社の「2月14日」は
 * 日付を書かない決まりに当たるため「毎年2月に」に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "毎年2月14日には、豊作を祈る「田の神祭り」が行われ、";
const TO = "毎年2月には、豊作を祈る「田の神祭り」が行われ、";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '158f73fa%'`);
  const itinId = rows[0].id;
  const mori = await findSpotInItinerary(itinId, { spotName: "森八幡神社" });

  if (!mori.memo?.includes(FROM)) throw new Error("森八幡神社の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: mori.id }, data: { memo: mori.memo!.replace(FROM, TO) } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

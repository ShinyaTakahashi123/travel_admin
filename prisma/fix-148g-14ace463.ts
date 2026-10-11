/**
 * #148 14ace463の直し(7回目、自己点検)。企画運営の指摘。遠野ふるさと村の
 * 結び「車でおよそ25分」と、荒神神社の実際のtransitDurationMin(26分)が
 * 食い違っていたため、結びの文言を「26分」にそろえる。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "この後は、車でおよそ25分、荒神神社へ向かいましょう。";
const TO = "この後は、車でおよそ26分、荒神神社へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '14ace463%'`);
  const itinId = rows[0].id;
  const furusato = await findSpotInItinerary(itinId, { spotName: "遠野ふるさと村" });

  if (!furusato.memo?.includes(FROM)) throw new Error("遠野ふるさと村の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: furusato.id }, data: { memo: furusato.memo!.replace(FROM, TO) } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

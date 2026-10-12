/**
 * #148 14ace463の直し(9回目、自己点検)。fix-148hで遠野郷八幡宮→福泉寺の
 * transitDurationMinを9→10分に直した際、遠野郷八幡宮の結びの文言
 * (「およそ9分」)を直し忘れていた。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "この後は、車でおよそ9分、福泉寺へ向かいましょう。";
const TO = "この後は、車でおよそ10分、福泉寺へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '14ace463%'`);
  const itinId = rows[0].id;
  const hachimangu = await findSpotInItinerary(itinId, { spotName: "遠野郷八幡宮" });

  if (!hachimangu.memo?.includes(FROM)) throw new Error("遠野郷八幡宮の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: hachimangu.id }, data: { memo: hachimangu.memo!.replace(FROM, TO) } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

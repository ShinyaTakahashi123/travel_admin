/**
 * #125 c4f58fddの直し(2回目)。itinerary-audit.cjsが「日本一深い湖」を
 * 言い切りとして検出(事実として正しいが、サイトの慣例どおり伝聞の形に)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "田沢湖は水深423.4mと日本一深い湖で、冬も凍らないほど澄んだ青さから";
const TO = "田沢湖は水深423.4mと日本一深い湖とされ、冬も凍らないほど澄んだ青さから";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c4f58fdd%'`);
  const itinId = rows[0].id;
  const tatsuko = await findSpotInItinerary(itinId, { spotName: "たつこ像" });

  if (!tatsuko.memo?.includes(FROM)) throw new Error("たつこ像の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: tatsuko.id }, { memo: tatsuko.memo!.replace(FROM, TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

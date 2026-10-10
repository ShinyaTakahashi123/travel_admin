/**
 * #21 feb07068 企画運営(2026-10-01 07:07)の指摘。fix-21で見落としていた
 * 飛鳥寺の「ご覧ください」を直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "1400年以上前からこの場所で人々を見守ってきた大仏の、穏やかな表情をじっくりとご覧ください。";
const TO = "1400年以上前からこの場所で人々を見守ってきた大仏の、穏やかな表情をじっくりと眺めてみてください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'feb07068%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "飛鳥寺" });
  if (!spot.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

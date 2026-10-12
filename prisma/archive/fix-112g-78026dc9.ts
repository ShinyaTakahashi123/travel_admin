/**
 * #112 78026dc9の直し(7回目)。法務(15:14)の指摘。広島県立美術館の
 * 「広島銀行の創業100周年を記念して」が今の会社名を出しているため、
 * 「地元の銀行の創業100周年を記念して」に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "昭和53年(1978)、広島銀行の創業100周年を記念して設立された美術館で、";
const TO = "昭和53年(1978)、地元の銀行の創業100周年を記念して設立された美術館で、";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '78026dc9%'`);
  const itinId = rows[0].id;
  const kenbi = await findSpotInItinerary(itinId, { spotName: "広島県立美術館" });

  if (!kenbi.memo!.includes(FROM)) throw new Error("広島県立美術館の文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: kenbi.id }, { memo: kenbi.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

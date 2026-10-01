/**
 * #109 746d20b3の直し(4回目)。itinerary-audit.cjsで、日吉神社の
 * 「毎年4月第3土曜・日曜」が曜日まで指定する言い回しとして検出された
 * (決まり: 年中行事は月・季節までにとどめ、曜日・日にちは書かない)。
 * 「毎年4月」に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "毎年4月第3土曜・日曜に行われる春祭りでは";
const TO = "毎年4月に行われる春祭りでは";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '746d20b3%'`);
  const itinId = rows[0].id;
  const hiyoshi = await findSpotInItinerary(itinId, { spotName: "日吉神社" });

  if (!hiyoshi.memo!.includes(FROM)) throw new Error("日吉神社の文言が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: hiyoshi.id }, { memo: hiyoshi.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

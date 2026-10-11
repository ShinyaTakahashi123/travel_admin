/**
 * #139 04618af3の直し(4回目、自己点検)。土井ヶ浜遺跡・人類学ミュージアムの
 * 「日本で唯一の人類学専門の博物館」がitinerary-auditの「言い切り?」で
 * 検出された(唯一=言い切りの語)。同じ文の中にぼかしを追加。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "日本で唯一の人類学専門の博物館では、";
const TO = "日本で唯一とされる人類学専門の博物館では、";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '04618af3%'`);
  const itinId = rows[0].id;
  const doigahama = await findSpotInItinerary(itinId, { spotName: "土井ヶ浜遺跡・人類学ミュージアム" });

  if (!doigahama.memo?.includes(FROM)) throw new Error("土井ヶ浜の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: doigahama.id }, data: { memo: doigahama.memo!.replace(FROM, TO) } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

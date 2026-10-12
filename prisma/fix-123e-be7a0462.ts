/**
 * #123 be7a0462の直し(5回目)。あわら湯のまち広場の「無料の足湯」が
 * itinerary-audit.cjsの料金記載チェックに引っかかった(「無料」も対象)。
 * 「足湯が整備されています」に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "無料の足湯が整備されています。";
const TO = "足湯が整備されています。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'be7a0462%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "あわら湯のまち広場" });
  if (!spot.memo?.includes(FROM)) throw new Error("文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

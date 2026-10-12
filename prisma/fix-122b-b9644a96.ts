/**
 * #122 b9644a96の直し(2回目)。ひがし茶屋街の「金沢で最も格式の高い茶屋街」
 * (言い切り、itinerary-audit.cjsの⚠)を、出典(ja.wikipedia.org/wiki/
 * ひがし茶屋街)で確認できなかったため伝聞に弱める。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "加賀藩によって公認された、金沢で最も格式の高い茶屋街です。";
const TO = "加賀藩によって公認された、金沢で最も格式が高いともいわれる茶屋街です。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'b9644a96%'`);
  const itinId = rows[0].id;
  const higashi = await findSpotInItinerary(itinId, { spotName: "ひがし茶屋街" });
  if (!higashi.memo?.includes(FROM)) throw new Error("文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: higashi.id }, { memo: higashi.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

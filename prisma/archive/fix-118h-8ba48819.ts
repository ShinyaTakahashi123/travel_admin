/**
 * #118 8ba48819の直し(8回目)。長瀬家の書き出しが「神田家から歩いて
 * すぐ」のままだったが、順番の入れ替え後は明善寺郷土館から来る
 * (歩いておよそ3分)。直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "神田家から歩いてすぐ、長瀬家に着きます。";
const TO = "明善寺郷土館から歩いておよそ3分、長瀬家に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '8ba48819%'`);
  const itinId = rows[0].id;
  const nagaseke = await findSpotInItinerary(itinId, { spotName: "長瀬家" });

  if (!nagaseke.memo!.includes(FROM)) throw new Error("長瀬家の文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: nagaseke.id }, { memo: nagaseke.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

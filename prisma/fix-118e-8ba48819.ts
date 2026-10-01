/**
 * #118 8ba48819の直し(5回目)。荻町合掌造り集落の座標修正(fix-118d)で
 * 集落→白川八幡神社の距離が変わり、申告の移動時間を12分に直したが、
 * 白川八幡神社の本文の書き出しが「歩いておよそ6分」のままだった。
 * 「12分」に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "荻町合掌造り集落から歩いておよそ6分、白川八幡神社に着きます。";
const TO = "荻町合掌造り集落から歩いておよそ12分、白川八幡神社に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '8ba48819%'`);
  const itinId = rows[0].id;
  const hachiman = await findSpotInItinerary(itinId, { spotName: "白川八幡神社" });

  if (!hachiman.memo!.includes(FROM)) throw new Error("白川八幡神社の文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: hachiman.id }, { memo: hachiman.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

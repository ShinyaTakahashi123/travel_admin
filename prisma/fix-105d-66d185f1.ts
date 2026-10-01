/**
 * #105 66d185f1 の直し(4回目)。itinerary-audit.cjsで、白糸の滝から白糸自然
 * 公園への移動(車で10分、0.5km)が「近いのに車」と指摘された。徒歩に直す
 * (0.5kmなら徒歩10分が妥当)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "白糸の滝から車でおよそ10分、白糸自然公園に着きます。";
const TO = "白糸の滝から歩いておよそ10分、白糸自然公園に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '66d185f1%'`);
  const itinId = rows[0].id;
  const park = await findSpotInItinerary(itinId, { spotName: "白糸自然公園" });
  if (!park.memo!.includes(FROM)) throw new Error("一致しません");
  if (park.transitMode !== "car") throw new Error("想定外の値です");
  console.log("OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: park.id }, {
    memo: park.memo!.replace(FROM, TO),
    transitMode: "walk",
  });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

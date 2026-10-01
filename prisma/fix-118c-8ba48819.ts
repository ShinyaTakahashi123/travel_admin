/**
 * #118 8ba48819の直し(3回目)。flow-check.cjsで荻町城跡展望台(最後の
 * スポット)に帰りの一言がないとの指摘。追加する。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "集落を歩いて感じた合掌造りの息づかいを、高台から俯瞰する景色とあわせて、旅の締めくくりに味わいましょう。";
const TO =
  "集落を歩いて感じた合掌造りの息づかいを、高台から俯瞰する景色とあわせて、旅の締めくくりに味わいましょう。シャトルバスか徒歩で集落まで戻り、高山濃飛バスセンター行きのバスで帰りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '8ba48819%'`);
  const itinId = rows[0].id;
  const tenbodai = await findSpotInItinerary(itinId, { spotName: "荻町城跡展望台" });

  if (!tenbodai.memo!.includes(FROM)) throw new Error("荻町城跡展望台の文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: tenbodai.id }, { memo: tenbodai.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

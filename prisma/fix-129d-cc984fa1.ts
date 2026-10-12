/**
 * #129 cc984fa1の直し(4回目)。自己点検: 三之堂の書き出し「山道を歩いて
 * およそ15分」が、fix-129bで移動時間を8分に直した後も文言のまま
 * 残っていた(データと文の不一致)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "摩尼殿から山道を歩いておよそ15分、境内の中でも最奥に近い";
const TO = "摩尼殿から山道を歩いておよそ8分、境内の中でも最奥に近い";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'cc984fa1%'`);
  const itinId = rows[0].id;
  const sannodo = await findSpotInItinerary(itinId, { spotName: "大講堂・三之堂" });

  if (!sannodo.memo?.includes(FROM)) throw new Error("三之堂の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: sannodo.id }, { memo: sannodo.memo!.replace(FROM, TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

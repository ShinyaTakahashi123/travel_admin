/**
 * #10 54f0fa20の直し(8回目)。自己点検: 好古園の文中「歩いておよそ15分」が
 * fix-10gで移動時間を7分に直した後も文言のまま残っていた(データと文の
 * 不一致)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "日本城郭研究センターから歩いておよそ15分、好古園に着きます。";
const TO = "日本城郭研究センターから歩いておよそ7分、好古園に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '54f0fa20%'`);
  const itinId = rows[0].id;
  const kokoen = await findSpotInItinerary(itinId, { spotName: "好古園" });

  if (!kokoen.memo?.includes(FROM)) throw new Error("好古園の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: kokoen.id }, { memo: kokoen.memo!.replace(FROM, TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

/**
 * #119 949c4f43の直し(11回目)。fix-119jで移動を8分に直したのに、
 * ドムトールンの文中の「歩いておよそ5分」を直し忘れていた(flow-checkで発見)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "パレスハウステンボスから歩いておよそ5分、ドムトールンに着きます。";
const TO = "パレスハウステンボスから歩いておよそ8分、ドムトールンに着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '949c4f43%'`);
  const itinId = rows[0].id;
  const dom = await findSpotInItinerary(itinId, { spotName: "ドムトールン" });
  if (!dom.memo?.includes(FROM)) throw new Error("文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: dom.id }, { memo: dom.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

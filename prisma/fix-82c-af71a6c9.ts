/**
 * #82 af71a6c9 fix-82bの見落とし。法務の気づき(2026-10-01 06:54)で、
 * 金沢21世紀美術館に「お楽しみください」が残っていることが判明。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "金沢の新しい顔ともいえる、現代アートの世界をお楽しみください。";
const TO = "金沢の新しい顔ともいえる、現代アートの世界を楽しめます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'af71a6c9%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "金沢21世紀美術館" });
  if (!spot.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

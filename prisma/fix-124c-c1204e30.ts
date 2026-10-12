/**
 * #124 c1204e30の直し(3回目)。flow-check.cjsで「1日目に昼食の一言なし」
 * が出た。美国のウニ丼の記述を、明確に昼食の一言として書き直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "夏場(例年6〜8月ごろ)を訪れると、地元の食堂で新鮮なウニ丼をいただくこともできます。";
const TO = "夏場(例年6〜8月ごろ)を訪れると、地元の食堂で新鮮なウニ丼をいただけるので、ここで昼食にしましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c1204e30%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "積丹半島（美国町）" });
  if (!spot.memo?.includes(FROM)) throw new Error("文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

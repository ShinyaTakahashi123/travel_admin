/**
 * #106 6ba2fc04 の直し(2回目)。itinerary-audit.cjsで、天橋立の
 * 「日本三景の一つに数えられる」が言い切りと指摘された(「数えられる」は
 * ヘッジ語として扱われないため)。「とされる」に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "日本三景の一つに数えられる、白砂青松が約3.6kmにわたって続く砂州です。";
const TO = "日本三景の一つとされる、白砂青松が約3.6kmにわたって続く砂州です。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6ba2fc04%'`);
  const itinId = rows[0].id;
  const amanohashidate = await findSpotInItinerary(itinId, { spotName: "天橋立" });
  if (!amanohashidate.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: amanohashidate.id }, { memo: amanohashidate.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

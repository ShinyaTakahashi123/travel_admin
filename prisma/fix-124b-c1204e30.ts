/**
 * #124 c1204e30の直し(2回目)。旧手宮線の「北海道で最初の鉄道」が
 * itinerary-audit.cjsの言い切りチェックに引っかかった(ヘッジ語なし)。
 * 「とされる」を補う。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "北海道で最初の鉄道「官営幌内鉄道」の名残です。";
const TO = "北海道で最初の鉄道とされる「官営幌内鉄道」の名残です。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c1204e30%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "旧手宮線" });
  if (!spot.memo?.includes(FROM)) throw new Error("文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

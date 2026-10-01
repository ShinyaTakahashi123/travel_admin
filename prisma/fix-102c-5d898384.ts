/**
 * #102 5d898384 の直し(3回目)。由比ヶ浜のメモが「歩いておよそ15分」としていたが、
 * transitDurationMinは10分のままだった(fix-102bでtransitModeだけをwalkに変えた際、
 * 分数は直さず文章だけ15分と書いてしまっていた)。実際の距離(約770m)は徒歩10分が
 * 妥当なため、文章を10分に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "長谷寺から歩いておよそ15分、由比ヶ浜に着きます。";
const TO = "長谷寺から歩いておよそ10分、由比ヶ浜に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5d898384%'`);
  const itinId = rows[0].id;
  const yuigahama = await findSpotInItinerary(itinId, { spotName: "由比ヶ浜" });
  if (!yuigahama.memo!.includes(FROM)) throw new Error("一致しません");
  if (yuigahama.transitDurationMin !== 10) throw new Error("transitDurationMinが想定外です");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: yuigahama.id }, { memo: yuigahama.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

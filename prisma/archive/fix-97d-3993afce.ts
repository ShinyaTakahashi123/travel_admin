/**
 * #97 3993afce の直し(4回目)。flow-check.cjs で「2日目に昼食の一言なし」と
 * 指摘された。竹生島から長浜港へ戻る12:55と長浜城歴史博物館の間に、昼食の
 * 一言を足す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "長浜港から歩いておよそ11分、長浜城歴史博物館に着きます。";
const TO = "長浜港に戻ったら、まずは昼食にしましょう。そこから歩いておよそ11分、長浜城歴史博物館に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '3993afce%'`);
  const itinId = rows[0].id;
  const castle = await findSpotInItinerary(itinId, { spotName: "長浜城歴史博物館" });
  if (!castle.memo!.includes(FROM)) throw new Error("想定外の値です");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: castle.id }, { memo: castle.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

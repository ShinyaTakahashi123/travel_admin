/**
 * #101 5bc07d20 の直し(2回目)。itinerary-audit.cjsで、大原美術館の
 * 「日本で最初の西洋美術中心の私立美術館です」が言い切りと指摘された。
 * ヘッジ表現に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "日本で最初の西洋美術中心の私立美術館です。";
const TO = "日本で最初の西洋美術中心の私立美術館とされています。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5bc07d20%'`);
  const itinId = rows[0].id;
  const ohara = await findSpotInItinerary(itinId, { spotName: "大原美術館" });
  if (!ohara.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: ohara.id }, { memo: ohara.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

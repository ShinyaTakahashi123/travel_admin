/**
 * #90 de041462 fix-90bの直し漏れ。「最初に訪れることになる」にまだ「最初」が
 * 残っており、itinerary-auditが「言い切り?」を継続して検出していた。
 * 「はじめに訪れる」に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "最初に訪れることになる「システィーナ・ホール」では";
const TO = "はじめに訪れる「システィーナ・ホール」では";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'de041462%'`);
  const itinId = rows[0].id;
  const otsuka = await findSpotInItinerary(itinId, { spotName: "大塚国際美術館" });
  if (!otsuka.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: otsuka.id }, { memo: otsuka.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

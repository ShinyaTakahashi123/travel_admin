/**
 * #128 c9b3ad40の直し(7回目)。企画運営の指摘: おかげ横丁の「あったそうです」
 * を「あったと伝えられています」に修正(報告不要の小さな直し)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "「施行」という助け合いがあったそうです。";
const TO = "「施行」という助け合いがあったと伝えられています。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c9b3ad40%'`);
  const itinId = rows[0].id;
  const okage = await findSpotInItinerary(itinId, { spotName: "おかげ横丁" });

  if (!okage.memo?.includes(FROM)) throw new Error("おかげ横丁の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: okage.id }, { memo: okage.memo!.replace(FROM, TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

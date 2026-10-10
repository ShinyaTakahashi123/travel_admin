/**
 * #40 1d70017a 企画運営(2026-10-01 06:58)の指摘。相差(石神さん)に
 * 「パワースポット」が残っていたのを外す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "近年ではその話が広く知られるようになり、全国各地から女性の参拝客が訪れる人気のパワースポットとなっています。";
const TO = "近年ではその話が広く知られるようになり、全国各地から女性の参拝客が訪れています。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '1d70017a%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "相差（石神さん）" });
  if (!spot.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

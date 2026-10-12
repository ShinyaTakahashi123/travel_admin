/**
 * #93 206f3ee6 企画運営(2026-10-01 00:22)の指摘。九島の行き来をタクシーに
 * した理由(決まり8、バス本数が少ないこと)が本文になかったため追記。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "宇和島駅からタクシーでおよそ14分、九島に着きます。";
const TO = "九島へのバスは本数が少ないため、宇和島駅からタクシーでおよそ14分、九島に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '206f3ee6%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "九島" });
  if (!spot.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

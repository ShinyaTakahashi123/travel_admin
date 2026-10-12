/**
 * #72 55a33667 熱海サンビーチと商店街、温泉街グルメを楽しむ1泊2日。
 * 企画運営(2026-10-01 06:27)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM =
  "熱海サンビーチから続いた、海と温泉街グルメを楽しむ1日目のリラックス旅も、ここで無事に終了です。今夜はこの近くの宿でゆっくり休みましょう。お疲れさまでした。";
const TO = "熱海サンビーチから続いた、海と温泉街グルメを楽しむ1日目のリラックス旅も、ここで終わりです。今夜はこの近くの宿でゆっくり休みましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '55a33667%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "姫の沢公園" });
  if (!spot.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

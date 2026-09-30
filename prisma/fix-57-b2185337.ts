/**
 * #57 b2185337 松江城と堀川めぐり、塩見縄手。水の城下町を楽しむ
 * 日帰りプラン。企画運営(2026-10-01 06:27)の口調直し。
 * 時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "松の木立と土塀が続く、城下町らしい風情を、ゆっくりと歩いてお楽しみください。";
const TO = "松の木立と土塀が続く、城下町らしい風情を、ゆっくりと歩いて楽しんでください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'b2185337%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "塩見縄手" });
  if (!spot.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

/**
 * 法務(2026-10-01 00:14)の指摘。#73 6062ae58 岡山城。
 * 記録: docs/content/legal-review/見直し-1日4か所.md 最後の節(e7fca92)
 * - 表町商店街: 「岡山県下最大の商店街」→「…とされる」
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "400年の歴史を持つ岡山県下最大の商店街です。";
const TO = "400年の歴史を持つ、岡山県下最大級とされる商店街です。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6062ae58%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "表町商店街" });
  if (!spot.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

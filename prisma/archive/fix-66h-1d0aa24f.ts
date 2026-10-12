/**
 * #66 1d0aa24f 湯沢高原ロープウェイで行く、絶景の雲海テラス日帰りプラン。
 * 企画運営(2026-10-01 06:27)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "高山植物園「アルプの里」の散策とあわせて、雲上のリゾートならではの開放感をどうぞお楽しみください。";
const TO = "高山植物園「アルプの里」の散策とあわせて、雲上のリゾートならではの開放感を味わってみてください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '1d0aa24f%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "湯沢高原ロープウェイ" });
  if (!spot.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

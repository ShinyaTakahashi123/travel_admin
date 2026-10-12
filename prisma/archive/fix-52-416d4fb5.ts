/**
 * #52 416d4fb5 仙娥滝と覚円峰、国の特別名勝・昇仙峡の渓谷美を歩く
 * 定番日帰りプラン。企画運営(2026-10-01 06:27)の口調直し。
 * 時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "山頂は岩場もあるので、足元に気をつけてお楽しみください。";
const TO = "山頂は岩場もあるので、足元に気をつけて楽しみましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '416d4fb5%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "昇仙峡ロープウェイ(パノラマ台)" });
  if (!spot.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

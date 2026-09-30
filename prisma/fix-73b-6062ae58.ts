/**
 * #73 6062ae58 flow-checkで見つかった不具合。表町商店街(もう最後ではない)に
 * 「岡山城・後楽園めぐりの締めくくりに」という表現が残っていたため、通常の
 * 文に修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6062ae58%'`);
  const itinId = rows[0].id;

  const spot = await findSpotInItinerary(itinId, { spotName: "表町商店街" });
  const from = "岡山城・後楽園めぐりの締めくくりに、老舗から新しい店まで入り混じる商店街の活気を楽しんでみてください。";
  const to = "老舗から新しい店まで入り混じる商店街の活気を楽しんでみてください。";
  if (!spot.memo!.includes(from)) throw new Error(`一致しません: ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log("表町商店街: OK");
  if (COMMIT) await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: newMemo });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

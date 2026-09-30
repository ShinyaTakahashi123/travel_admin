/**
 * #95 310ab81d fix-95cの直後の直し。各日1か所目(表浜海岸・クリスタルポルト)の
 * transitDurationMinが、時刻の再計算ヘルパーの初期値(??0)のせいで0に
 * なっていた(transitModeはnullのまま)。1日目の最初のスポットはtransitが
 * 存在しないのが正しい状態のため、nullに戻す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '310ab81d%'`);
  const itinId = rows[0].id;
  for (const name of ["表浜海岸", "道の駅伊良湖クリスタルポルト"]) {
    const s = await findSpotInItinerary(itinId, { spotName: name });
    console.log(name, "現在:", s.transitMode, s.transitDurationMin);
    if (!COMMIT) continue;
    await updateSpotInItinerary(itinId, { spotId: s.id }, { transitDurationMin: null });
    console.log(`  COMMITTED: ${name}`);
  }
  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());

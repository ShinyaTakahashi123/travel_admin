/**
 * #86 c77a7701 fix-86cのバグ修正。川反のtransitDurationMinに、誤って
 * 次のスポット(赤れんが郷土館)への移動時間(9分)を入れてしまい、実際の
 * 直前(市民市場からの5分)と食い違っていた(itinerary-auditで発覚)。
 * 5分に戻す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c77a7701%'`);
  const itinId = rows[0].id;
  const kawabata = await findSpotInItinerary(itinId, { spotName: "川反" });
  console.log("川反 transitDurationMin:", kawabata.transitDurationMin, "→ 5に変更");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: kawabata.id }, { transitDurationMin: 5 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

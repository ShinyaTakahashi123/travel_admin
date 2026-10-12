/**
 * #55 66782e35の直し(3回目)。fix-55bでtransitDurationMinを7→5に
 * 直したが、visitTimeを連動させ忘れたため「時刻の計算が合わない」が
 * 発生していた。神明神社(石神さん)のvisitTimeを16:33→16:31に直す
 * (相差海女文化資料館の終わり16:26+5分)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '66782e35%'`);
  const itinId = rows[0].id;
  const jinja = await findSpotInItinerary(itinId, { spotName: "神明神社(石神さん)" });

  console.log("現在のvisitTime:", jinja.visitTime);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: jinja.id }, { visitTime: t(16, 31) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

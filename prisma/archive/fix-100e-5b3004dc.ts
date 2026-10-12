/**
 * #100 5b3004dc の直し(5回目)。fix-100dで穂高神社奥宮のvisitTimeを
 * 14:15に直した際、transitDurationMinを90→35に直し忘れていた
 * (前のスポットとの間隔35分に対し、移動時間が90分のままで不整合)。
 * itinerary-audit.cjsの「時刻の計算が合わない」指摘で発覚。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5b3004dc%'`);
  const itinId = rows[0].id;
  const okumiya = await findSpotInItinerary(itinId, { spotName: "穂高神社奥宮" });
  console.log("現在のtransitDurationMin:", okumiya.transitDurationMin);
  if (okumiya.transitDurationMin !== 90) throw new Error("想定外の値です");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: okumiya.id }, { transitDurationMin: 35 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

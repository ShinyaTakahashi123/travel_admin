/**
 * #100 5b3004dc の直し(3回目)。fix-100bで大正池の滞在を100分→110分にした際、
 * 田代池のvisitTimeを合わせて10分ずらすのを忘れていた(11:00のままで、大正池の
 * 終了10:50+移動20分=11:10のはずが10分ずれていた)。itinerary-audit.cjsの
 * 「時刻の計算が合わない」指摘で発覚。田代池のvisitTimeを11:10に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5b3004dc%'`);
  const itinId = rows[0].id;
  const tashiroike = await findSpotInItinerary(itinId, { spotName: "田代池" });
  const vt = tashiroike.visitTime!;
  const cur = `${vt.getUTCHours()}:${vt.getUTCMinutes()}`;
  console.log("現在のvisitTime:", cur);
  if (cur !== "11:0") throw new Error("想定外の値です");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: tashiroike.id }, { visitTime: t(11, 10) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

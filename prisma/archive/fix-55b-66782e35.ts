/**
 * #55 66782e35の直し(2回目)。相差海女文化資料館の結び「歩いておよそ
 * 5分」と神明神社(石神さん)の書き出し「歩いておよそ5分」は文章同士で
 * 一致しているが、DBのtransitDurationMinが7になっていた。文章に
 * あわせて5に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '66782e35%'`);
  const itinId = rows[0].id;
  const jinja = await findSpotInItinerary(itinId, { spotName: "神明神社(石神さん)" });

  if (jinja.transitMode !== "walk" || jinja.transitDurationMin !== 7) throw new Error("想定外の値です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: jinja.id }, { transitDurationMin: 5 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

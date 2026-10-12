/**
 * #136 e47d75dfの直し(4回目、自己点検)。fix-136cで三四郎島のトンボロの
 * visitTimeを明示的に更新し忘れ、古い値(12:28)が残っていた。
 * 堂ヶ島の出発(12:21)+移動9分=12:30に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'e47d75df%'`);
  const itinId = rows[0].id;
  const tombolo = await findSpotInItinerary(itinId, { spotName: "三四郎島のトンボロ" });

  const current = tombolo.visitTime?.toISOString().slice(11, 16);
  console.log("現在のvisitTime:", current);
  if (current !== "12:28") throw new Error("想定外の現在値です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: tombolo.id }, data: { visitTime: t(12, 30) } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

/**
 * #146 0fe4fa73の直し(8回目、自己点検)。fix-146gでROKKO森の音ミュージ
 * アムのtransitDurationMinを12分に直したが、visitTimeの間隔(10分)との
 * 食い違いで「時刻の計算が合わない」と検出された。到着を14:52に、
 * 滞在を58分(到着までの2分を吸収し、出発15:50は変えない)に修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '0fe4fa73%'`);
  const itinId = rows[0].id;
  const morinooto = await findSpotInItinerary(itinId, { spotName: "ROKKO森の音ミュージアム" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({
    where: { id: morinooto.id },
    data: { visitTime: t(14, 52), stayDurationMin: 58 },
  });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

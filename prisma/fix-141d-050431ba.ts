/**
 * #141 050431baの直し(4回目、自己点検)。八甲田山麓→八甲田ロープウェーの
 * transitDurationMinを12分に直したが、visitTimeの間隔(0分)とずれて
 * 「時刻の計算が合わない」と検出された。ロープウェー以降の時刻を
 * 12分ずらす。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '050431ba%'`);
  const itinId = rows[0].id;
  const ropeway = await findSpotInItinerary(itinId, { spotName: "八甲田ロープウェー" });
  const seiryuji = await findSpotInItinerary(itinId, { spotName: "青龍寺" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({ where: { id: ropeway.id }, data: { visitTime: t(13, 27) } }),
    prisma.spot.update({ where: { id: seiryuji.id }, data: { visitTime: t(15, 47) } }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

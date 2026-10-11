/**
 * #144 0d8b6309の直し(3回目、自己点検)。fix-144bで如意輪寺の出発が
 * 10:15早まったのに、吉水神社のvisitTimeが古い10:35のままで「時刻の
 * 計算が合わない」と検出された。10:25に修正。あわせて吉野山参道の
 * 移動(金峯山寺から歩いてすぐ)のtransitDurationMinを1→0に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '0d8b6309%'`);
  const itinId = rows[0].id;
  const yoshimizu = await findSpotInItinerary(itinId, { spotName: "吉水神社" });
  const sando = await findSpotInItinerary(itinId, { spotName: "吉野山参道" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({ where: { id: yoshimizu.id }, data: { visitTime: t(10, 25) } }),
    prisma.spot.update({
      where: { id: sando.id },
      data: { transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 0 }] } },
    }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

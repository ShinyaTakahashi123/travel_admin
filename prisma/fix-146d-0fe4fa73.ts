/**
 * #146 0fe4fa73の直し(4回目、自己点検)。fix-146cでDay1の各スポットの
 * visitTimeを計算違いのまま設定していたため、「時刻の計算が合わない」
 * が複数件検出された。正しい時刻に修正し、あわせて天覧台の滞在を
 * 130→95分にして終了を16:30に収める。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '0fe4fa73%'`);
  const itinId = rows[0].id;
  const kinenhidai = await findSpotInItinerary(itinId, { spotName: "記念碑台" });
  const bokujo = await findSpotInItinerary(itinId, { spotName: "六甲山牧場" });
  const shokubutsuen = await findSpotInItinerary(itinId, { spotName: "六甲高山植物園" });
  const terrace = await findSpotInItinerary(itinId, { spotName: "六甲ガーデンテラス" });
  const tenrandai = await findSpotInItinerary(itinId, { spotName: "六甲山天覧台" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({ where: { id: kinenhidai.id }, data: { visitTime: t(10, 0) } }),
    prisma.spot.update({ where: { id: bokujo.id }, data: { visitTime: t(10, 40) } }),
    prisma.spot.update({ where: { id: shokubutsuen.id }, data: { visitTime: t(12, 25) } }),
    prisma.spot.update({ where: { id: terrace.id }, data: { visitTime: t(13, 30) } }),
    prisma.spot.update({ where: { id: tenrandai.id }, data: { visitTime: t(14, 55), stayDurationMin: 95 } }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

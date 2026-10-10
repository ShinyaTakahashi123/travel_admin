/**
 * #86 c77a7701 fix-86のバグ修正。秋田市民市場の既存の滞在は60分(50分と
 * 思い込んでいた)だったため、09:00開始+60分=10:00終了のところ、川反の
 * visitTimeを09:55にしてしまい、市民市場がまだ終わっていない時刻に川反が
 * 始まる形になっていた(itinerary-auditの「時刻の計算が合わない」で発覚)。
 * 以降の全スポットのvisitTimeを、正しい市民市場の終了時刻(10:00)を起点に
 * 再計算する。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c77a7701%'`);
  const itinId = rows[0].id;

  const targets: [string, Date][] = [
    ["川反", t(10, 5)],
    ["秋田市民俗芸能伝承館(ねぶり流し館)", t(11, 41)],
    ["秋田県立美術館", t(12, 30)],
    ["秋田市文化創造館", t(13, 55)],
    ["千秋公園", t(14, 46)],
  ];

  for (const [name, vt] of targets) {
    const s = await findSpotInItinerary(itinId, { spotName: name });
    console.log(`${name}: ${s.visitTime} → ${vt}`);
    if (COMMIT) await updateSpotInItinerary(itinId, { spotId: s.id }, { visitTime: vt });
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

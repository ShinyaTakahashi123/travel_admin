/**
 * #140 0986be13の直し(2回目、自己点検)。和楽足湯の「無料の足湯です」が
 * itinerary-auditの「料金・時刻・日程・先の予定の記載」で検出された
 * (無料=禁止語、#139の角島大橋と同じパターン)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "温泉街の入り口、銀山川のほとりにある無料の足湯です。";
const TO = "温泉街の入り口、銀山川のほとりにある足湯です。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '0986be13%'`);
  const itinId = rows[0].id;
  const ashiyu = await findSpotInItinerary(itinId, { spotName: "和楽足湯" });

  if (!ashiyu.memo?.includes(FROM)) throw new Error("和楽足湯の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: ashiyu.id }, data: { memo: ashiyu.memo!.replace(FROM, TO) } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

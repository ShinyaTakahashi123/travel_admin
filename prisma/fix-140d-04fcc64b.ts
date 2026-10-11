/**
 * #140 04fcc64bの直し(4回目、自己点検)。
 * ①ゲレンデの座標をゴンドラの駅(unnamed)に変更したことで、駅からの
 *   距離が2.3kmになったのに、transitModeがwalk/7分のままで「徒歩が
 *   速すぎ」と検出された(実際はゴンドラでの移動)。walk→otherに修正。
 *   ゲレンデ→ゆきあそびパーク(山麓へ戻る側)も同じ理由でotherに修正。
 * ②西口駅前広場足湯の「無料の足湯です」が、itinerary-auditの
 *   「料金・時刻・日程・先の予定の記載」で検出された(無料=禁止語、
 *   #139・#142と同じパターン)。「無料の」を外す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const ASHIYU_FROM = "駅の西口にある、無料の足湯です。";
const ASHIYU_TO = "駅の西口にある足湯です。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '04fcc64b%'`);
  const itinId = rows[0].id;
  const gerende = await findSpotInItinerary(itinId, { spotName: "ゲレンデ" });
  const yukiasobi = await findSpotInItinerary(itinId, { spotName: "ゆきあそびパーク" });
  const ashiyu = await findSpotInItinerary(itinId, { spotName: "西口駅前広場足湯" });

  if (!ashiyu.memo?.includes(ASHIYU_FROM)) throw new Error("西口駅前広場足湯の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({
      where: { id: gerende.id },
      data: { transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "other", transitDurationMin: 7 }] } },
    }),
    prisma.spot.update({
      where: { id: yukiasobi.id },
      data: { transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "other", transitDurationMin: 7 }] } },
    }),
    prisma.spot.update({ where: { id: ashiyu.id }, data: { memo: ashiyu.memo!.replace(ASHIYU_FROM, ASHIYU_TO) } }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

/**
 * #132 d45c6b3bの直し(9回目)。企画運営(2026-10-11)の指摘。
 * 白石城の甲冑体験の一文は、見つかった2つの出典(gltjp・2018年の
 * japankuru)がいずれも公式でなく、内容も食い違い(要予約/予約不要)、
 * 今も行われているか確かめられないため、一般化ではなく削除する。
 * 復元のいきさつまでで十分、という判断。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "解体から120年ぶりの再建です。甲冑を着て、記念撮影ができる体験も用意されています。見学を終えたら、";
const TO = "解体から120年ぶりの再建です。見学を終えたら、";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd45c6b3b%'`);
  const itinId = rows[0].id;
  const shiroishijo = await findSpotInItinerary(itinId, { spotName: "白石城" });

  if (!shiroishijo.memo?.includes(FROM)) throw new Error("白石城の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: shiroishijo.id }, { memo: shiroishijo.memo!.replace(FROM, TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

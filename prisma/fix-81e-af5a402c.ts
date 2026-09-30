/**
 * #81 af5a402c fix-81c/dの続き。牛たん通り・すし通りのvisitTimeも更新前の
 * まま(13:54)残っていた。SS30が13:31-14:06になったため、14:13に修正。
 * (榴岡公園のvisitTime 15:29は、この14:13+50分+移動26分の結果と一致する
 * ため変更不要)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'af5a402c%'`);
  const itinId = rows[0].id;

  const gyutan = await findSpotInItinerary(itinId, { spotName: "牛たん通り・すし通り" });
  console.log("牛たん通り 現在:", gyutan.visitTime, "→ 14:13に変更");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: gyutan.id }, { visitTime: t(14, 13) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

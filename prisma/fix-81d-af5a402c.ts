/**
 * #81 af5a402c fix-81cのバグ修正。SS30展望フロアと榴岡公園のvisitTimeが
 * 更新前のまま(古い時刻)残っていた(itinerary-auditの「時刻の計算が合わない」
 * で発覚)。上流の時刻変更にあわせて再計算。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'af5a402c%'`);
  const itinId = rows[0].id;

  const ss30 = await findSpotInItinerary(itinId, { spotName: "SS30展望フロア" });
  const tsutsuji = await findSpotInItinerary(itinId, { spotName: "榴岡公園" });

  console.log("SS30 現在:", ss30.visitTime, "→ 13:31に変更");
  console.log("榴岡公園 現在:", tsutsuji.visitTime, "→ 15:29に変更");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: ss30.id }, { visitTime: t(13, 31) });
  await updateSpotInItinerary(itinId, { spotId: tsutsuji.id }, { visitTime: t(15, 29) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

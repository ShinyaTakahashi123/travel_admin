/**
 * チェックリスト #293 の修正記録(続き、itinerary-audit.cjsのセルフチェックで発見)。
 * しおり「四万十川と沈下橋、『日本最後の清流』を望む定番日帰りプラン」
 * (44e8538a-315e-4ab9-8ed5-1451de24b872)
 *
 * fix-293で四万十市立郷土博物館(14:20開始・60分)の終了(15:20)と、
 * あきついおの開始(15:35)の間が15分空いてしまっていた(移動10分と不一致)。
 * あきついおの開始を15:30に修正。
 *
 * itinerary-audit.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-293b-44e8538a.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "44e8538a-315e-4ab9-8ed5-1451de24b872";

async function main() {
  const akituio = await findSpotInItinerary(ITIN_ID, { spotName: "四万十川学遊館あきついお" });
  const row = await prisma.spot.findUniqueOrThrow({ where: { id: akituio.id } });
  if (row.visitTime?.getUTCHours() === 15 && row.visitTime?.getUTCMinutes() === 35) {
    await updateSpotInItinerary(ITIN_ID, { spotId: akituio.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 30)),
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

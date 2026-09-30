/**
 * チェックリスト #306 の修正記録(セルフチェックで発見)。
 * しおり「富士山を一望、大石公園と河口湖の定番絶景スポット日帰りプラン」
 * (62195fcc-88cc-4287-81fd-4c43b73a86a6)
 *
 * 新屋山神社のvisitTimeの計算が10分ずれていた(忍野八海15:35終了+移動12分
 * =15:47のところ、15:57のまま)ため補正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-306b-62195fcc.ts
 * (実行済み。時刻で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "62195fcc-88cc-4287-81fd-4c43b73a86a6";

async function main() {
  const shrine = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "新屋山神社" },
  });
  if (shrine.visitTime?.getUTCHours() === 15 && shrine.visitTime?.getUTCMinutes() === 57) {
    await updateSpotInItinerary(ITIN_ID, { spotId: shrine.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 47)),
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

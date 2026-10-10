/**
 * #319の続き(自己チェックの気づき)。
 * fix-319で大宮盆栽美術館のstayDurationMinは60分に直したが、visitTimeを
 * 更新し忘れ、旧い値(13:30、鉄道博物館の元の滞在時間から計算した古い時刻)
 * のまま残っていた(itinerary-auditの「時刻の計算が合わない」で検出)。
 * 鉄道博物館の終了(12:30)+車15分=12:45に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-319b-7d80c940.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "7d80c940-0507-41af-8688-ccb64b79a0a1";

async function main() {
  const bonsai = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "大宮盆栽美術館" },
  });
  if (bonsai.visitTime?.getUTCHours() === 13 && bonsai.visitTime?.getUTCMinutes() === 30) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: bonsai.id },
      { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 45)) }
    );
  }
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

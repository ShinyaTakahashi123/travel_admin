/**
 * チェックリスト #300 の修正記録(2巡目、監査ツールの検出への対応)。
 * しおり「京橋と林原美術館、旭川のほとりで水辺と美術を楽しむ1泊2日」
 * (573dd48c-8210-408d-9f3e-422e03e507bb)
 *
 * itinerary-audit.cjsで、旭川さくらみち→岡山後楽園の移動が「徒歩が速すぎ 0.6km/3分」と
 * 検出された。旭川さくらみちの座標(南側の入口)から岡山後楽園までの実際の距離(約0.64km)に
 * あわせて、移動を3分→8分に修正。スケジュール全体を変えないよう、岡山後楽園の滞在を
 * 165分→160分に5分短縮し、開始時刻も11:10→11:15に修正(前のスポットの終了11:07+移動8分)。
 * 以降の時刻はもともとこの値を前提に計算していたため変更なし(終了16:34のまま)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-300b-573dd48c.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "573dd48c-8210-408d-9f3e-422e03e507bb";

async function main() {
  const korakuen = await findSpotInItinerary(ITIN_ID, { spotName: "岡山後楽園" });
  const row = await prisma.spot.findUniqueOrThrow({ where: { id: korakuen.id } });
  if (row.transitDurationMin === 3) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: korakuen.id },
      {
        transitDurationMin: 8,
        stayDurationMin: 160,
        visitTime: new Date(Date.UTC(1970, 0, 1, 11, 15)),
      }
    );
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: korakuen.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: korakuen.id, orderNo: 1, transitMode: "walk", transitDurationMin: 8 },
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

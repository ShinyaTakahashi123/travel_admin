/**
 * チェックリスト #306 の修正記録(法務指摘: 距離の確認)。
 * しおり「富士山を一望、大石公園と河口湖の定番絶景スポット日帰りプラン」
 * (62195fcc-88cc-4287-81fd-4c43b73a86a6)
 *
 * 法務の指摘: 北口本宮冨士浅間神社→新屋山神社の「徒歩10分」が実際の
 * 距離に対して短すぎるのではとの指摘。座標を新屋山神社公式サイト
 * (https://www.yamajinja.jp/、住所「富士吉田市新屋4-2-2」)の住所で
 * 国土地理院の住所検索と照合したところ、既存の座標(Nominatim)とは
 * 70mほどの差で、直線距離はおよそ0.6kmと確認できたが、実際の道路は
 * 直線ではなく国道139号を挟むため、徒歩の所要時間の見積もりが不確かだった。
 * この旅は元々車でめぐる構成(最初のスポットに明記)のため、この区間も
 * 徒歩からcar/5分に変更し、あいまいな徒歩時間の記載を避けた。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-306e-62195fcc.ts
 * (実行済み。transitModeで確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "62195fcc-88cc-4287-81fd-4c43b73a86a6";

async function main() {
  const shrine = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "新屋山神社" },
  });
  if (shrine.transitMode === "walk") {
    const fixedMemo = (shrine.memo ?? "").replace(
      "北口本宮冨士浅間神社からは徒歩10分ほどです。",
      "北口本宮冨士浅間神社からは車で5分ほどです。"
    );
    await updateSpotInItinerary(ITIN_ID, { spotId: shrine.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 16, 7)),
      transitMode: "car",
      transitDurationMin: 5,
      memo: fixedMemo,
    });
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: shrine.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: shrine.id, orderNo: 1, transitMode: "car", transitDurationMin: 5 },
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

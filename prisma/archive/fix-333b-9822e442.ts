/**
 * #333の続き。法務2026-10-01 05:33の指摘: アドベンチャーワールドに
 * 動物への配慮の一文を追加。白良浜にも波・足元への注意の一文を追加(任意)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-333b-9822e442.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "9822e442-ce98-40e8-8afe-be361795fb09";

async function main() {
  const park = await prisma.spot.findFirstOrThrow({ where: { name: "アドベンチャーワールド", day: { itineraryId: ITIN_ID } } });
  {
    const old = "園内には複数のレストランがあるので、このあたりで昼食をとりましょう。";
    const next =
      "園内には複数のレストランがあるので、このあたりで昼食をとりましょう。動物たちを驚かせないよう、ガラスをたたいたり、決められたもの以外のえさをあげたりせず、ふれあいは係員の案内に従いましょう。";
    if (!park.memo?.includes(next)) {
      if (!park.memo?.includes(old)) throw new Error("park text not found");
      await updateSpotInItinerary(ITIN_ID, { spotId: park.id }, { memo: park.memo.replace(old, next) });
      console.log("park updated");
    } else {
      console.log("park already applied");
    }
  }

  const beach = await prisma.spot.findFirstOrThrow({ where: { name: "白良浜", day: { itineraryId: ITIN_ID } } });
  {
    const old = "波打ち際を歩きながら、1日の締めくくりに、ゆったりとした時間を過ごしてみましょう。";
    const next = "波や足元に気をつけながら、波打ち際を歩いて、1日の締めくくりに、ゆったりとした時間を過ごしてみましょう。";
    if (!beach.memo?.includes(next)) {
      if (!beach.memo?.includes(old)) throw new Error("beach text not found");
      await updateSpotInItinerary(ITIN_ID, { spotId: beach.id }, { memo: beach.memo.replace(old, next) });
      console.log("beach updated");
    } else {
      console.log("beach already applied");
    }
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

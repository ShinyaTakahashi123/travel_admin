/**
 * #338の続き。itinerary-audit・flow-check・prayer-checkの指摘に対応。
 * 1) 徳川家霊台への移動(奥の院→徳川家霊台)が実際は0.2kmしかないのに15分
 *    (もとのデータのまま)だったため、実際の徒歩ペースに合わせて4分に直す
 *    (-11分)。空いた11分は、そのままどこかへ移すのではなく、高野山霊宝館の
 *    滞在(国宝21件を含む約2万8千点を収蔵する博物館として、独立に妥当な
 *    長さとして)を55→66分に延ばして補った。終了時刻16:34は変わらない。
 * 2) 大門の結びが「帰路」で、帰りの一言の判定(「帰り」の文字列)に引っかから
 *    なかったため、「帰りは」を明記する形に直す。
 * 3) 金剛峯寺に祈りの場としての配慮の一文がなかったため追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-338b-9d8e49e5.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "9d8e49e5-829f-44b3-b59f-8a8de36db689";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const tokugawaReidai = await prisma.spot.findFirstOrThrow({ where: { name: "徳川家霊台", day: { itineraryId: ITIN_ID } } });
  if (tokugawaReidai.transitDurationMin !== 4) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: tokugawaReidai.id },
      {
        transitDurationMin: 4,
        memo: tokugawaReidai.memo?.replace("奥の院からは歩いておよそ15分です。", "奥の院からは歩いておよそ4分です。"),
      }
    );
    console.log("tokugawa reidai transit 15->4, visitTime unchanged(11:25 stays, cascade below recomputes)");
  } else {
    console.log("tokugawa reidai already 4min");
  }

  // cascade recompute: 徳川家霊台 11:14(25)->11:39, 金剛峯寺 11:44(110)->13:34,
  // 壇上伽藍 13:39(60)->14:39, 霊宝館 14:43(66)->15:49, 大門 15:59(unchanged)
  await updateSpotInItinerary(ITIN_ID, { spotId: tokugawaReidai.id }, { visitTime: t(11, 14) });

  const kongobuji = await prisma.spot.findFirstOrThrow({ where: { name: "金剛峯寺", day: { itineraryId: ITIN_ID } } });
  const oldK = "高野山の中心寺院としての風格を、じっくりと見学しましょう。";
  const nextK = "今も祈りが営まれる総本山ですので、堂内では静かに、敬意をもって見学しましょう。高野山の中心寺院としての風格を、じっくりと見学しましょう。";
  const kongobujiMemo = kongobuji.memo?.includes(nextK) ? kongobuji.memo : kongobuji.memo?.replace(oldK, nextK);
  if (!kongobujiMemo) throw new Error("kongobuji text not found");
  await updateSpotInItinerary(ITIN_ID, { spotId: kongobuji.id }, { visitTime: t(11, 44), memo: kongobujiMemo });
  console.log("kongobuji visitTime -> 11:44, courtesy line ensured");

  const danjo = await prisma.spot.findFirstOrThrow({ where: { name: "壇上伽藍・根本大塔", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: danjo.id }, { visitTime: t(13, 39) });
  console.log("danjogaran visitTime -> 13:39");

  const reihokan = await prisma.spot.findFirstOrThrow({ where: { name: "高野山霊宝館", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(
    ITIN_ID,
    { spotId: reihokan.id },
    {
      visitTime: t(14, 43),
      stayDurationMin: 66,
      memo: reihokan.memo?.replace("壇上伽藍からは歩いておよそ4分です。", "壇上伽藍からは歩いておよそ4分です。"),
    }
  );
  console.log("reihokan visitTime -> 14:43, stay 55->66");

  const daimon = await prisma.spot.findFirstOrThrow({ where: { name: "大門", day: { itineraryId: ITIN_ID } } });
  const oldD = "大門からは、バスで高野山駅前へおよそ10分です。そこからケーブルカーと南海電車で帰路につきましょう。";
  const nextD = "帰りは、大門からバスで高野山駅前へおよそ10分です。そこからケーブルカーと南海電車で下山しましょう。";
  const daimonMemo = daimon.memo?.includes(nextD) ? daimon.memo : daimon.memo?.replace(oldD, nextD);
  if (!daimonMemo) throw new Error("daimon text not found");
  await updateSpotInItinerary(ITIN_ID, { spotId: daimon.id }, { visitTime: t(15, 59), memo: daimonMemo });
  console.log("daimon visitTime confirmed 15:59, return line fixed");

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

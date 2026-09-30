/**
 * #326の続き。fix-326g後の再確認で2件を検出(自己チェック)。
 * 1) 片岡鶴太郎美術館→西の河原公園(0.3km)をtransit 2分と宣言していたが
 *    徒歩速度9km/hとなり速すぎた。5分に直し、西の河原公園のvisitTimeも
 *    合わせた。
 * 2) 温泉図書館(35分, 変更なし)→地蔵の湯の間隔が実際は15分だったが、
 *    transitを10分と宣言していたため不一致。15分に直した(宣言済みの
 *    「坂の上り下りがあるため」という一言とも整合する)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-326h-89522173.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "89522173-3b95-4393-a808-5ed5d465d85b";

async function main() {
  const nishinokawara = await prisma.spot.findFirstOrThrow({
    where: { name: "西の河原公園・露天風呂", day: { itineraryId: ITIN_ID } },
  });
  if (nishinokawara.transitDurationMin !== 5) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: nishinokawara.id },
      { transitDurationMin: 5, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 57)) }
    );
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: nishinokawara.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: nishinokawara.id, orderNo: 1, transitMode: "walk", transitDurationMin: 5 },
    });
    console.log("nishinokawara updated");
  }

  const jizo = await prisma.spot.findFirstOrThrow({
    where: { name: "地蔵の湯", day: { itineraryId: ITIN_ID } },
  });
  if (jizo.transitDurationMin !== 15) {
    await updateSpotInItinerary(ITIN_ID, { spotId: jizo.id }, { transitDurationMin: 15 });
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: jizo.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: jizo.id, orderNo: 1, transitMode: "walk", transitDurationMin: 15 },
    });
    console.log("jizo updated");
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

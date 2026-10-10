/**
 * #263(1f5e18c2 維新ふるさと館と天文館、幕末の記憶と鹿児島グルメの1泊2日)。
 * 制作補助2の気づき(企画運営09:35転送): 尚古集成館の座標が31.6238,130.5795で、
 * OSMの建物の点(31.6173,130.5763、仙巌園の入口のそば)から約750m北にずれていた。
 * 正しい座標に直し、仙巌園からの実際の距離(およそ0.9km)にあわせて移動時間を
 * 3分→11分に修正、後続のvisitTimeも合わせて再計算した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-263-1f5e18c2.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "1f5e18c2-61b0-4697-aa5f-8067bab107f5";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const shokoShuseikan = await prisma.spot.findFirstOrThrow({ where: { name: "尚古集成館", day: { itineraryId: ITIN_ID } } });
  if (shokoShuseikan.transitDurationMin === 11) {
    console.log("already fixed");
    return;
  }

  // 本文は「仙巌園からはおよそN分です」のような分数を明記する書き方ではなく、
  // 「仙巌園の正面入り口のすぐそば」という説明のみのため、本文は変更しない。
  await updateSpotInItinerary(
    ITIN_ID,
    { spotId: shokoShuseikan.id },
    {
      lat: 31.6173,
      lng: 130.5763,
      transitDurationMin: 11,
      visitTime: t(14, 23),
    }
  );
  console.log("shokoshuseikan coordinates + transit fixed");

  const kagoshimaChuo = await prisma.spot.findFirstOrThrow({ where: { name: "鹿児島中央駅", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: kagoshimaChuo.id }, { visitTime: t(15, 44) });
  console.log("kagoshima chuo station visitTime -> 15:44");

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

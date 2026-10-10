/**
 * #337の続き。企画運営07:07の指摘: 昼食が建中寺(お寺)の枠に入っていたが、
 * 境内では食事できないため、文化のみち二葉館(お寺ではない)の枠に移す。
 * 時間の合計は変えず、二葉館30→70分(+40)、建中寺70→30分(-40)で調整。
 * 終了時刻は16:42のまま変わらない。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-337c-9d4badcb.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "9d4badcb-ec4d-4eaf-97af-b173d3d4ff5d";

async function main() {
  const futabakan = await prisma.spot.findFirstOrThrow({ where: { name: "文化のみち二葉館", day: { itineraryId: ITIN_ID } } });
  if (futabakan.stayDurationMin !== 70) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: futabakan.id },
      {
        stayDurationMin: 70,
        memo:
          "名古屋市市政資料館からは歩いておよそ11分です。文化のみち二葉館は、「日本の女優第一号」と呼ばれる川上貞奴が、大正時代に暮らした和洋折衷の邸宅を移築復元した建物で、平成17年(2005)に「文化のみち」の拠点施設として開館しました。館内には、川上貞奴にゆかりの資料や、この地にゆかりのある文学資料が展示され、ステンドグラスを配した洋館の意匠も見どころです。名古屋の近代を彩った女性の暮らしぶりに触れてみましょう。見学のあとは、このあたり「文化のみち」周辺の飲食店で昼食をとるとよいでしょう。続いては、歩いておよそ10分の建中寺へ向かいましょう。",
      }
    );
    console.log("futabakan: stay 30->70, lunch line added");
  } else {
    console.log("futabakan already 70min");
  }

  const kenchuji = await prisma.spot.findFirstOrThrow({ where: { name: "建中寺", day: { itineraryId: ITIN_ID } } });
  if (kenchuji.stayDurationMin !== 30) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: kenchuji.id },
      {
        stayDurationMin: 30,
        memo:
          "文化のみち二葉館からは歩いておよそ10分です。建中寺は、初代尾張藩主・徳川義直の菩提を弔うため、慶安4年(1651)、第2代藩主・徳川光友によって建立された、尾張徳川家の菩提寺です。創建当時のものと伝わる三門・総門をはじめ、歴代藩主の霊廟や、国の登録有形文化財に指定される徳興殿など、江戸時代の広大な寺観を今に伝えています。今も法要が営まれる祈りの場ですので、境内では静かに、敬意をもってお参りください。続いては、歩いておよそ10分の徳川美術館へ向かいましょう。",
      }
    );
    console.log("kenchuji: stay 70->30, lunch line removed");
  } else {
    console.log("kenchuji already 30min");
  }

  const tokugawaMuseum = await prisma.spot.findFirstOrThrow({ where: { name: "徳川美術館", day: { itineraryId: ITIN_ID } } });
  const targetVisitTime = new Date(Date.UTC(1970, 0, 1, 14, 10));
  if (tokugawaMuseum.visitTime?.getTime() !== targetVisitTime.getTime()) {
    await updateSpotInItinerary(ITIN_ID, { spotId: tokugawaMuseum.id }, { visitTime: targetVisitTime });
    console.log("tokugawa museum visitTime confirmed/adjusted to 14:10");
  } else {
    console.log("tokugawa museum visitTime already 14:10");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

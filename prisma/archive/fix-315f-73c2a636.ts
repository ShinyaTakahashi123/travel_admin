/**
 * #315の続き(自己チェックの気づき)。
 * fix-315eで児島虎次郎記念館の座標を大原美術館の点に寄せたことで、次の
 * UKIYO-E KURASHIKI/国芳館への移動時間(2分)が、直線距離(およそ0.3km)に
 * 対して短すぎる状態になっていた(itinerary-audit.cjsで検出、時速9km相当)。
 * 実際の道のりを考慮し5分に修正し、後続スポットの時刻も+3分でずらした。
 *
 * 新しい時刻: 13:22国芳館(45)→14:10加計美術館(50)→15:01倉敷民藝館(40)→
 * 15:45倉敷市立美術館(60)→16:45終了。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-315f-73c2a636.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "73c2a636-6381-4cf5-9f24-f7d344692cc1";

async function main() {
  const ukiyoe = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "UKIYO-E KURASHIKI/国芳館" },
  });
  if (ukiyoe.transitDurationMin !== 5) {
    const newMemo = (ukiyoe.memo ?? "").replace(
      "児島虎次郎記念館からは歩いておよそ2分です。",
      "児島虎次郎記念館からは歩いておよそ5分です。"
    );
    await updateSpotInItinerary(ITIN_ID, { spotId: ukiyoe.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 13, 22)),
      transitDurationMin: 5,
      memo: newMemo,
    });

    const kake = await prisma.spot.findFirstOrThrow({
      where: { day: { itineraryId: ITIN_ID }, name: "加計美術館" },
    });
    await updateSpotInItinerary(ITIN_ID, { spotId: kake.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 10)),
    });

    const mingei = await prisma.spot.findFirstOrThrow({
      where: { day: { itineraryId: ITIN_ID }, name: "倉敷民藝館" },
    });
    await updateSpotInItinerary(ITIN_ID, { spotId: mingei.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 1)),
    });

    const kcam = await prisma.spot.findFirstOrThrow({
      where: { day: { itineraryId: ITIN_ID }, name: "倉敷市立美術館" },
    });
    await updateSpotInItinerary(ITIN_ID, { spotId: kcam.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 45)),
    });
  }
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

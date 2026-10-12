/**
 * #339の続き。itinerary-audit・flow-checkの指摘に対応。
 * 1) 由布岳のstayDurationMinが150分のままで、本文の「往復4〜5時間」と
 *    合っていなかった(時刻の計算が合わない)。270分(4.5時間)に修正。
 * 2) 1日目に昼食の一言がなかったため、登山中にお弁当を広げる旨を由布岳の
 *    本文に追加。
 * 3) 塚原温泉・湯の坪街道の「三大」「屈指」に、監査ツールが認識するヘッジ語
 *    (ともいわれ/といわれ)を追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-339b-9da78e5d.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "9da78e5d-1fdd-415d-bd06-46c13d62d732";

async function main() {
  const yufudake = await prisma.spot.findFirstOrThrow({ where: { name: "由布岳", day: { itineraryId: ITIN_ID } } });
  if (yufudake.stayDurationMin !== 270) {
    const old = "登山靴などの装備を整え、事前に天気予報を確かめたうえで、下山の時刻に余裕を持った計画で臨みましょう。";
    const next =
      "登山靴などの装備を整え、事前に天気予報を確かめたうえで、下山の時刻に余裕を持った計画で臨みましょう。山頂やお気に入りの場所でお弁当を広げ、昼食をとるのもよいでしょう。";
    if (!yufudake.memo?.includes(old)) throw new Error("yufudake text not found");
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: yufudake.id },
      { stayDurationMin: 270, memo: yufudake.memo.replace(old, next) }
    );
    console.log("yufudake stay 150->270, lunch line added");
  } else {
    console.log("yufudake already 270min");
  }

  const tsukahara = await prisma.spot.findFirstOrThrow({ where: { name: "塚原温泉 火口乃泉", day: { itineraryId: ITIN_ID } } });
  const oldT = "強い酸性の泉質でも知られる「日本三大薬湯」の一つに数えられています。";
  const nextT = "強い酸性の泉質でも知られ、「日本三大薬湯」の一つともいわれています。";
  if (tsukahara.memo?.includes(oldT)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: tsukahara.id }, { memo: tsukahara.memo.replace(oldT, nextT) });
    console.log("tsukahara hedge added");
  } else {
    console.log("tsukahara already fixed");
  }

  const yunotsubo = await prisma.spot.findFirstOrThrow({ where: { name: "湯の坪街道", day: { itineraryId: ITIN_ID } } });
  const oldY = "由布院でも屈指の賑わいを見せる通りです。";
  const nextY = "由布院でも屈指の賑わいを見せる通りといわれています。";
  if (yunotsubo.memo?.includes(oldY)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: yunotsubo.id }, { memo: yunotsubo.memo.replace(oldY, nextY) });
    console.log("yunotsubo hedge added");
  } else {
    console.log("yunotsubo already fixed");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

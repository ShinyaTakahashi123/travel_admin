/**
 * #263の続き。企画運営09:55の指摘: 1日目の昼食が西郷隆盛銅像の20分(銅像の前)に
 * 入っていたが、銅像の前では食べられず、20分では足りない。時間は延ばさずに、
 * 昼食の一言を黎明館(60分、もとから見学時間に余裕がある)に移した。
 * 黎明館の周辺(鶴丸城跡のあたり)には実在の食事処(そばところ更科、
 * ラーメン専門ほんや等、OSM raw APIで確認)があるため、「このあたりの
 * 食事処で昼食をとる」という表現は実態に合っている。
 * 到着は12:46で11:30〜13:30の範囲内。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-263d-1f5e18c2.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "1f5e18c2-61b0-4697-aa5f-8067bab107f5";

async function main() {
  const dozo = await prisma.spot.findFirstOrThrow({ where: { name: "西郷隆盛銅像", day: { itineraryId: ITIN_ID } } });
  const reimeikan = await prisma.spot.findFirstOrThrow({
    where: { name: "鹿児島県歴史・美術センター黎明館", day: { itineraryId: ITIN_ID } },
  });

  const dozoOld = "鹿児島を代表する記念撮影スポットです。このあたりの食事処で昼食をとるとよいでしょう。見学を終えたら、歩いて鹿児島県歴史・美術センター黎明館へ向かいましょう。";
  const dozoNext = "鹿児島を代表する記念撮影スポットです。見学を終えたら、歩いて鹿児島県歴史・美術センター黎明館へ向かいましょう。";
  if (!dozo.memo?.includes(dozoOld)) throw new Error("dozo anchor not found");

  const reimeikanOld =
    "西郷隆盛銅像を見学したら、歩いて鹿児島県歴史・美術センター黎明館へ向かいましょう。島津家の居城「鶴丸城」の本丸跡に立つ、昭和58年(1983)開館の県立総合博物館です。";
  const reimeikanNext =
    "西郷隆盛銅像を見学したら、歩いて鹿児島県歴史・美術センター黎明館へ向かいましょう。到着したら、まずこのあたりの食事処で昼食をとり、それから見学するとよいでしょう。島津家の居城「鶴丸城」の本丸跡に立つ、昭和58年(1983)開館の県立総合博物館です。";
  if (!reimeikan.memo?.includes(reimeikanOld)) throw new Error("reimeikan anchor not found");

  if (!dozo.memo.includes("このあたりの食事処で昼食をとるとよいでしょう。見学")) {
    console.log("dozo already fixed, skipping");
  } else {
    await updateSpotInItinerary(ITIN_ID, { spotId: dozo.id }, { memo: dozo.memo.replace(dozoOld, dozoNext) });
    console.log("dozo lunch line removed");
  }

  if (reimeikan.memo.includes("まずこのあたりの食事処で昼食をとり")) {
    console.log("reimeikan already fixed, skipping");
  } else {
    await updateSpotInItinerary(ITIN_ID, { spotId: reimeikan.id }, { memo: reimeikan.memo.replace(reimeikanOld, reimeikanNext) });
    console.log("reimeikan lunch line added");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

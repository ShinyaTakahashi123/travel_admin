/**
 * #355の続き。
 * - 旧大社駅→出雲日御碕灯台の移動手段を車(car)からタクシー(taxi)に変更。
 *   一畑バスの大社・日御碕線は、現在「ミナバイラルート」経由に変更されており、
 *   旧JR大社駅そばの停留所は終日通行止めのため、この区間は公共交通の直通便がない。
 *   出典: 検索結果一致(一畑バス案内)
 * - 日帰りプランの最後のスポット(日御碕神社)に「帰りの一言」がなかったため追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-355c-bb5348fc.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "bb5348fc-c7db-472c-82fc-5ddb3db3253b";

async function main() {
  const toudai = await prisma.spot.findFirstOrThrow({ where: { name: "出雲日御碕灯台", day: { itineraryId: ITIN_ID } }, include: { transitLegs: true } });
  if (toudai.transitLegs[0]?.transitMode !== "taxi") {
    await updateSpotInItinerary(ITIN_ID, { spotId: toudai.id }, {
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "taxi", transitDurationMin: 16 }] },
    });
    console.log("出雲日御碕灯台: 移動手段をタクシーに修正");
  } else {
    console.log("出雲日御碕灯台: 既に対応済み");
  }

  const hinomisakijinja = await prisma.spot.findFirstOrThrow({ where: { name: "日御碕神社", day: { itineraryId: ITIN_ID } } });
  const old = "出雲観光の締めくくりに、縁結びの神様と古代出雲の歴史に触れる1日を振り返りましょう。";
  const next = "バスで出雲市駅・いずも縁結び空港方面へ戻り、縁結びの神様と古代出雲の歴史に触れた1日を振り返りましょう。";
  if (hinomisakijinja.memo?.includes(old)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: hinomisakijinja.id }, { memo: hinomisakijinja.memo.replace(old, next) });
    console.log("日御碕神社: 帰りの一言を追加");
  } else {
    console.log("日御碕神社: 既に対応済み");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

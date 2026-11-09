/**
 * 関宿＋伊賀上野(地方のしおり候補6)の登録後の直し。
 * 1. 道の駅関宿→伊賀上野城のtransitLeg(train/50)を、徒歩3分(関駅まで)＋待ち2分(関駅、関西本線の
 *    発車待ち)＋電車37分(関→伊賀上野、列車番号241D)＋タクシー8分(伊賀上野駅→伊賀上野城、OSRM
 *    3.3分+5)の4件に分ける(乗り物が変わる場所を書く決まり、法務の指摘2026-11-03で「待ち」も
 *    区間として残す)。
 * 2. 季節を四季すべてに設定(桜・紅葉など特定の季節の見どころがなく、屋内展示や町歩きが中心のため。
 *    杵築と同じ扱い)。
 * 使い方: npm run prod -- npx tsx prisma/fix-local-sekiueno1-leg.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const TITLE = "東海道関宿の町並みと伊賀上野城、二つの城下町をめぐる日帰りプラン";
const SPOT_NAME = "伊賀上野城";

async function main() {
  const commit = process.argv.includes("--commit");
  const it = await prisma.itinerary.findFirstOrThrow({ where: { title: TITLE } });
  const day = await prisma.day.findFirstOrThrow({
    where: { itineraryId: it.id },
    include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: true } } },
  });
  const spot = day.spots.find((s) => s.name === SPOT_NAME);
  if (!spot) throw new Error("伊賀上野城が見つかりません");
  const leg = spot.transitLegs[0];
  if (!leg) throw new Error("伊賀上野城のtransitLegが見つかりません");
  console.log("直す前:", leg.transitMode, leg.transitDurationMin, "分 (orderNo", leg.orderNo, ")");
  console.log(
    "直した後: leg1=walk/3 + leg2=other(待ち)/2 + leg3=train/37 + leg4=taxi/8 (orderNo",
    leg.orderNo,
    "〜",
    leg.orderNo + 3,
    ")",
  );
  console.log("季節:", it.seasons, "→", ["spring", "summer", "autumn", "winter"]);

  if (commit) {
    await prisma.$transaction([
      prisma.spotTransitLeg.update({
        where: { id: leg.id },
        data: { transitMode: "walk", transitDurationMin: 3 },
      }),
      prisma.spotTransitLeg.create({
        data: { spotId: spot.id, orderNo: leg.orderNo + 1, transitMode: "other", transitDurationMin: 2 },
      }),
      prisma.spotTransitLeg.create({
        data: { spotId: spot.id, orderNo: leg.orderNo + 2, transitMode: "train", transitDurationMin: 37 },
      }),
      prisma.spotTransitLeg.create({
        data: { spotId: spot.id, orderNo: leg.orderNo + 3, transitMode: "taxi", transitDurationMin: 8 },
      }),
      prisma.itinerary.update({
        where: { id: it.id },
        data: { seasons: ["spring", "summer", "autumn", "winter"] },
      }),
    ]);
    console.log("書き込みました。");
  } else {
    console.log("(確認モード。--commit で書き込みます)");
  }
}
main().finally(() => prisma.$disconnect());

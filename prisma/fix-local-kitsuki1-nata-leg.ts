/**
 * 杵築(地方のしおり候補3)の登録後の直し。
 * 1. 杵築レトロ館→奈多八幡宮のtransitLeg(car/19)を、徒歩7分(杵築城の駐車場まで)＋車12分
 *    (OSRM7.4分+5、奈多宮へ)の2件に分ける(handmade-genは1スポット1件のため、登録後にこちらで分ける)。
 * 2. 季節を春夏秋冬の4つに設定(handmade-genは未設定のため、登録直後に行う決まり)。
 * 使い方: npm run prod -- npx tsx prisma/fix-local-kitsuki1-nata-leg.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const TITLE = "杵築城と酢屋の坂・塩屋の坂、城下町と奈多海岸をめぐる日帰りプラン";
const NATA_SPOT_NAME = "奈多八幡宮";

async function main() {
  const commit = process.argv.includes("--commit");
  const it = await prisma.itinerary.findFirstOrThrow({ where: { title: TITLE } });
  const day = await prisma.day.findFirstOrThrow({
    where: { itineraryId: it.id },
    include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: true } } },
  });
  const nataSpot = day.spots.find((s) => s.name === NATA_SPOT_NAME);
  if (!nataSpot) throw new Error("奈多八幡宮が見つかりません");
  const leg = nataSpot.transitLegs[0];
  if (!leg) throw new Error("奈多八幡宮のtransitLegが見つかりません");
  console.log("直す前:", leg.transitMode, leg.transitDurationMin, "分 (orderNo", leg.orderNo, ")");
  console.log("直した後: leg1=walk/7 (orderNo", leg.orderNo, ") + leg2=car/12 (orderNo", leg.orderNo + 1, ")");
  console.log("季節:", it.seasons, "→", ["spring", "summer", "autumn", "winter"]);

  if (commit) {
    await prisma.$transaction([
      prisma.spotTransitLeg.update({
        where: { id: leg.id },
        data: { transitMode: "walk", transitDurationMin: 7 },
      }),
      prisma.spotTransitLeg.create({
        data: {
          spotId: nataSpot.id,
          orderNo: leg.orderNo + 1,
          transitMode: "car",
          transitDurationMin: 12,
        },
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

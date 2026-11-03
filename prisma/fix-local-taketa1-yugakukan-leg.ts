/**
 * 竹田(地方のしおり候補5)の登録後の直し。
 * 1. 竹田市歴史文化館・由学館→白水ダムのtransitLeg(car/28)を、徒歩2分(旧竹田荘のそばの駐車場まで)
 *    ＋車26分(OSRM21.4分+5、白水ダムへ)の2件に分ける。
 * 2. 季節を夏・秋に設定(白水ダムの越流が見られる時期・岡城跡に桜の話がないため。企画運営の決定)。
 * 使い方: npm run prod -- npx tsx prisma/fix-local-taketa1-yugakukan-leg.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const TITLE = "岡城跡と「荒城の月」ゆかりの地、竹田の城下町をめぐる日帰りプラン";
const SPOT_NAME = "白水ダム";

async function main() {
  const commit = process.argv.includes("--commit");
  const it = await prisma.itinerary.findFirstOrThrow({ where: { title: TITLE } });
  const day = await prisma.day.findFirstOrThrow({
    where: { itineraryId: it.id },
    include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: true } } },
  });
  const spot = day.spots.find((s) => s.name === SPOT_NAME);
  if (!spot) throw new Error("白水ダムが見つかりません");
  const leg = spot.transitLegs[0];
  if (!leg) throw new Error("白水ダムのtransitLegが見つかりません");
  console.log("直す前:", leg.transitMode, leg.transitDurationMin, "分 (orderNo", leg.orderNo, ")");
  console.log("直した後: leg1=walk/2 (orderNo", leg.orderNo, ") + leg2=car/26 (orderNo", leg.orderNo + 1, ")");
  console.log("季節:", it.seasons, "→", ["summer", "autumn"]);

  if (commit) {
    await prisma.$transaction([
      prisma.spotTransitLeg.update({
        where: { id: leg.id },
        data: { transitMode: "walk", transitDurationMin: 2 },
      }),
      prisma.spotTransitLeg.create({
        data: {
          spotId: spot.id,
          orderNo: leg.orderNo + 1,
          transitMode: "car",
          transitDurationMin: 26,
        },
      }),
      prisma.itinerary.update({
        where: { id: it.id },
        data: { seasons: ["summer", "autumn"] },
      }),
    ]);
    console.log("書き込みました。");
  } else {
    console.log("(確認モード。--commit で書き込みます)");
  }
}
main().finally(() => prisma.$disconnect());

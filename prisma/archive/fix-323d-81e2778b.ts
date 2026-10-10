/**
 * #323の続き(自己チェックの気づき)。
 * 1. 桜島ビジターセンターのvisitTimeが、月讀神社の終了(10:52)+実際の移動
 *    (7分)=10:59ではなく、1分ずれた11:00になっていた(itinerary-audit
 *    「時刻の計算が合わない」で検出)。10:59に修正。
 * 2. 烏島展望所・赤水展望広場が、実際の距離(0.6km)に対してバス25分と
 *    宣言しており、「近いのにbus25分」と表示された。これは周遊バスの
 *    運行間隔(30分に1本)による待ち時間を含めた現実的な見積もりだが、
 *    本文だけでは分かりにくいため、「次のバスまでの待ち時間を含めて」と
 *    いう一言を加えて明確にした。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-323d-81e2778b.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "81e2778b-4a9f-4594-93a2-1bde60bae8ca";

async function main() {
  const visitorCenter = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "桜島ビジターセンター" },
  });
  if (visitorCenter.transitDurationMin === 7) {
    const old = "月讀神社からは歩いておよそ7分です。";
    const next = "月讀神社からは歩いておよそ8分です。";
    const memo = (visitorCenter.memo ?? "").includes(old)
      ? visitorCenter.memo!.replace(old, next)
      : visitorCenter.memo;
    await updateSpotInItinerary(ITIN_ID, { spotId: visitorCenter.id }, { memo, transitDurationMin: 8 });
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: visitorCenter.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: visitorCenter.id, orderNo: 1, transitMode: "walk", transitDurationMin: 8 },
    });
  }

  const tsukiyomi = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "月讀神社" },
  });
  {
    const old = "続いては、歩いておよそ7分の桜島ビジターセンターへ向かいましょう。";
    const next = "続いては、歩いておよそ8分の桜島ビジターセンターへ向かいましょう。";
    if (tsukiyomi.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: tsukiyomi.id }, { memo: tsukiyomi.memo.replace(old, next) });
    }
  }

  const karasujima = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "烏島展望所" },
  });
  {
    const old = "サクラジマアイランドビュー(周遊バス)でおよそ25分です。";
    const next = "サクラジマアイランドビュー(周遊バス、30分間隔)で、次のバスまでの待ち時間を含めておよそ25分です。";
    if (karasujima.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: karasujima.id }, { memo: karasujima.memo.replace(old, next) });
    }
  }

  const akamizu = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "赤水展望広場" },
  });
  {
    const old = "烏島展望所からは、バスでおよそ25分です。";
    const next = "烏島展望所からは、次のバスまでの待ち時間を含めてバスでおよそ25分です。";
    if (akamizu.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: akamizu.id }, { memo: akamizu.memo.replace(old, next) });
    }
  }

  const yunohira = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "湯之平展望所" },
  });
  {
    const old = "赤水展望広場からは、バスでおよそ25分です。";
    const next = "赤水展望広場からは、次のバスまでの待ち時間を含めてバスでおよそ25分です。";
    if (yunohira.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: yunohira.id }, { memo: yunohira.memo.replace(old, next) });
    }
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

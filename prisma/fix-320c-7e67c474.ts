/**
 * #320の続き。企画運営2026-09-30 23:14の指摘。
 * fix-320bで「窓に合わせるため舞鶴城公園90→100分・藤村記念館30→40分も
 * あわせて延ばした」のは、決まりAの水増しだったとの指摘。元の長さに戻し、
 * 足りない約20分は、企画運営の提案どおり大泉寺(武田信虎の菩提寺、信虎・
 * 信玄・勝頼3代の肖像を安置する霊廟がある、武田神社から徒歩圏)を追加して
 * 埋めた。
 *
 * 帰りの一言も、いちばん最後の場所(大泉寺)のメモに移した(指摘の2点目)。
 * なお「今は武田神社のメモに残っていて、次に信玄ミュージアムが来るなら
 * 食い違う」というご指摘については、実際の並び順はfix-320bの時点で既に
 * 美術館→文学館→舞鶴城公園→藤村記念館→信玄ミュージアム→武田神社(最後)
 * だったため、帰りの一言自体は正しい位置にありましたが、大泉寺を追加した
 * のに伴い、新しい最後の場所である大泉寺のメモに移しました。
 *
 * 座標の出典: 大泉寺、Nominatimで名称一致。way 226825157,
 * 35.6769967,138.5808910
 * 事実確認: yamanashi-kankou.jp公式・kofu-tourism.com(信虎の菩提寺、
 * 信濃高遠で没した信虎の葬儀もここで営まれ埋葬、霊廟に信虎・信玄・勝頼
 * 3代の肖像)
 * 移動時間の出典: 甲府駅北口からバス5分(武田3丁目下車)+徒歩10分で大泉寺
 * (city.kofu.yamanashi.jp公式ページの説明を参考に、帰りの一言に反映)。
 * 武田神社⇔大泉寺は直線距離約1.1kmから徒歩約14分と概算
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-320c-7e67c474.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "7e67c474-4ea2-4ca5-9b1e-ed4d053632ff";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "大泉寺" } });
  if (already) {
    console.log("already applied, skipping spot creation");
    return;
  }

  const bijutsukan = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "山梨県立美術館" } });
  const bungakukan = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "山梨県立文学館" } });
  const maizuru = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "舞鶴城公園" } });
  const fujimura = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "藤村記念館" } });
  const museum = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "信玄ミュージアム" } });
  const takeda = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "武田神社" } });

  const takedaMemo = (takeda.memo ?? "").replace(
    "見学を終えたら、バスで甲府駅まで戻りましょう(およそ10分)。",
    "続いては、歩いておよそ14分の大泉寺へ向かいましょう。"
  );

  await setDaySpotOrder(day1.id, [
    { id: bijutsukan.id, data: {} },
    { id: bungakukan.id, data: {} },
    { id: maizuru.id, data: { stayDurationMin: 90 } },
    {
      id: fujimura.id,
      data: { stayDurationMin: 30, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 58)) },
    },
    {
      id: museum.id,
      data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 38)) },
    },
    {
      id: takeda.id,
      data: { memo: takedaMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 26)) },
    },
    {
      create: {
        name: "大泉寺",
        address: "甲府市古府中町5015",
        lat: 35.6769967,
        lng: 138.580891,
        visitTime: new Date(Date.UTC(1970, 0, 1, 16, 25)),
        stayDurationMin: 20,
        transitMode: "walk",
        transitDurationMin: 14,
        memo:
          "武田神社からは歩いておよそ14分です。大泉寺は、武田信玄の父・信虎が、天桂禅長を開山として建てた寺です。信濃国高遠で亡くなった信虎の葬儀もここで営まれ、遺骸が埋葬されました。本堂の奥には霊廟があり、信虎・信玄・勝頼、武田家3代の肖像が安置されています。武田家ゆかりの寺に、静かに、敬意をもってお参りください。見学を終えたら、バス停まで歩き(およそ10分)、バスで甲府駅まで戻りましょう(およそ5分)。",
      },
    },
  ]);

  const daisenji = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "大泉寺" } });
  await prisma.spotTransitLeg.deleteMany({ where: { spotId: daisenji.id } });
  await prisma.spotTransitLeg.create({
    data: { spotId: daisenji.id, orderNo: 1, transitMode: "walk", transitDurationMin: 14 },
  });

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

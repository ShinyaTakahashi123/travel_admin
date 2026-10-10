/**
 * #320の続き。企画運営2026-09-30 23:08の4点 + 法務2026-09-30 23:04の1点
 * (共通)に対応。
 *
 * 1) 終わりが16:20で窓(16:30〜17:00)に入っていなかった。
 * 2) 武田神社100分は決まりA違反(小さすぎる滞在ではなく長すぎる方)。45分に
 *    短縮し、隣接する信玄ミュージアム(甲府市武田氏館跡歴史館、平成31年
 *    (2019)開館、常設展示室は無料・特別展示室のみ有料、武田神社まで徒歩
 *    2〜3分)を新規スポットとして追加。1)と2)により、舞鶴城公園90→100分・
 *    藤村記念館30→40分もあわせて延ばし、16:30〜16:31に着地させた。
 * 3) 武田神社「金運を招くとも伝わる『三葉の松』」のご利益をうたう言い方を、
 *    「葉が3本に分かれた珍しい松『三葉の松』」に直した(企画運営・法務共通、
 *    #306新屋山神社と同じ扱い)。
 * 4) 山梨県立美術館の書き出しに「JR甲府駅からバスでおよそ14分」を追加。
 *    武田神社(最後のスポット)の帰りの一言(バスで甲府駅までおよそ10分)は
 *    既にあったため、信玄ミュージアムの追加後もそのまま活かした。
 *
 * 座標の出典: 信玄ミュージアム(武田氏館跡歴史館) Nominatimで名称一致。
 * way 793329998, 35.6852534,138.5771355
 * 事実確認: city.kofu.yamanashi.jp公式(開館9:00〜17:00、常設展示室は無料・
 * 特別展示室のみ有料、武田神社に隣接・駐車場共用)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-320b-7e67c474.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "7e67c474-4ea2-4ca5-9b1e-ed4d053632ff";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "信玄ミュージアム" } });
  if (already) {
    console.log("already applied, skipping spot creation");
    return;
  }

  const bijutsukan = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "山梨県立美術館" } });
  const bungakukan = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "山梨県立文学館" } });
  const maizuru = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "舞鶴城公園" } });
  const fujimura = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "藤村記念館" } });
  const takeda = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "武田神社" } });

  const bijutsukanMemo = (bijutsukan.memo ?? "").replace(
    "山梨県立美術館は、",
    "JR甲府駅からバスでおよそ14分。山梨県立美術館は、"
  );

  const fujimuraMemo = (fujimura.memo ?? "").replace(
    "続いては、甲府駅からバスでおよそ12分の武田神社へ向かいましょう。",
    "続いては、甲府駅からバスでおよそ10分の信玄ミュージアムへ向かいましょう。"
  );

  const takedaMemo = (takeda.memo ?? "")
    .replace(
      "藤村記念館からは、甲府駅のバス停まで歩き、バスでおよそ12分です。",
      "信玄ミュージアムからは歩いてすぐです。"
    )
    .replace("金運を招くとも伝わる「三葉の松」", "葉が3本に分かれた珍しい松「三葉の松」");

  await setDaySpotOrder(day1.id, [
    { id: bijutsukan.id, data: { memo: bijutsukanMemo } },
    { id: bungakukan.id, data: {} },
    { id: maizuru.id, data: { stayDurationMin: 100 } },
    {
      id: fujimura.id,
      data: { memo: fujimuraMemo, stayDurationMin: 40, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 8)) },
    },
    {
      create: {
        name: "信玄ミュージアム",
        address: "甲府市大手3丁目1-14",
        lat: 35.6852534,
        lng: 138.5771355,
        visitTime: new Date(Date.UTC(1970, 0, 1, 14, 58)),
        stayDurationMin: 45,
        transitMode: "bus",
        transitDurationMin: 10,
        memo:
          "藤村記念館からは、甲府駅のバス停まで歩き、バスでおよそ10分です。信玄ミュージアム(甲府市武田氏館跡歴史館)は、国史跡・武田氏館跡の歴史や見どころを紹介するガイダンス施設として、平成31年(2019)に開館しました。武田神社の境内に隣接し、出土品や資料をもとに、武田氏3代が本拠とした館の姿を分かりやすく伝えています。武田神社を訪れる前に、ここで館跡の歴史にふれておきましょう。続いては、歩いてすぐの武田神社へ向かいましょう。",
      },
    },
    {
      id: takeda.id,
      data: {
        memo: takedaMemo,
        stayDurationMin: 45,
        visitTime: new Date(Date.UTC(1970, 0, 1, 15, 46)),
        transitMode: "walk",
        transitDurationMin: 3,
      },
    },
  ]);

  const museum = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "信玄ミュージアム" } });
  await prisma.spotTransitLeg.deleteMany({ where: { spotId: museum.id } });
  await prisma.spotTransitLeg.create({
    data: { spotId: museum.id, orderNo: 1, transitMode: "bus", transitDurationMin: 10 },
  });

  const takedaAfter = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "武田神社" } });
  await prisma.spotTransitLeg.deleteMany({ where: { spotId: takedaAfter.id } });
  await prisma.spotTransitLeg.create({
    data: { spotId: takedaAfter.id, orderNo: 1, transitMode: "walk", transitDurationMin: 3 },
  });

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #338の続き。企画運営07:17の指摘: fix-338bで霊宝館の滞在を55→66分に延ばして
 * 埋めたのは、まさに指摘され続けている水増し。霊宝館を55分に戻し、空いた時間は
 * 実在のスポット(金剛三昧院、国宝の多宝塔)を新たに足して埋める。あわせて、
 * 奥の院に南海高野山駅からのバスでの行き方(28分、公式時刻表で確認)を追加。
 * 大門の帰りの一言はfix-338bで追加済みのため変更なし。
 *
 * 終了時刻が16:57になるよう、大門の滞在も35→25分に調整(門を見上げる程度の
 * 妥当な長さ)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-338c-9d8e49e5.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "9d8e49e5-829f-44b3-b59f-8a8de36db689";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const already = await prisma.spot.findFirst({ where: { name: "金剛三昧院", day: { itineraryId: ITIN_ID } } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const day = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID } });
  const okunoin = await prisma.spot.findFirstOrThrow({ where: { name: "奥の院", dayId: day.id } });
  const tokugawaReidai = await prisma.spot.findFirstOrThrow({ where: { name: "徳川家霊台", dayId: day.id } });
  const kongobuji = await prisma.spot.findFirstOrThrow({ where: { name: "金剛峯寺", dayId: day.id } });
  const danjo = await prisma.spot.findFirstOrThrow({ where: { name: "壇上伽藍・根本大塔", dayId: day.id } });
  const reihokan = await prisma.spot.findFirstOrThrow({ where: { name: "高野山霊宝館", dayId: day.id } });
  const daimon = await prisma.spot.findFirstOrThrow({ where: { name: "大門", dayId: day.id } });

  const okunoinOld = "奥の院は、高野山で最も神聖な霊域とされ、";
  const okunoinNext = "南海高野山駅から、バスでおよそ28分の奥の院前バス停が最寄りです。奥の院は、高野山で最も神聖な霊域とされ、";
  if (!okunoin.memo?.includes(okunoinOld)) throw new Error("okunoin text not found");
  const okunoinMemo = okunoin.memo.includes(okunoinNext) ? okunoin.memo : okunoin.memo.replace(okunoinOld, okunoinNext);

  const tokugawaOld = "続いては、歩いておよそ5分の金剛峯寺へ向かいましょう。";
  const tokugawaNext = "続いては、歩いておよそ7分の金剛三昧院へ向かいましょう。";
  if (!tokugawaReidai.memo?.includes(tokugawaOld)) throw new Error("tokugawa text not found");
  const tokugawaMemo = tokugawaReidai.memo.replace(tokugawaOld, tokugawaNext);

  const kongobujiOld = "徳川家霊台からは歩いておよそ5分です。";
  const kongobujiNext = "金剛三昧院からは歩いておよそ7分です。";
  if (!kongobuji.memo?.includes(kongobujiOld)) throw new Error("kongobuji text not found");
  const kongobujiMemo = kongobuji.memo.replace(kongobujiOld, kongobujiNext);

  await setDaySpotOrder(day.id, [
    { id: okunoin.id, data: { memo: okunoinMemo } },
    { id: tokugawaReidai.id, data: { memo: tokugawaMemo } },
    {
      create: {
        name: "金剛三昧院",
        address: "伊都郡高野町高野山425",
        lat: 34.2101236,
        lng: 135.5869835,
        visitTime: t(11, 46),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 7,
        memo:
          "徳川家霊台からは歩いておよそ7分です。金剛三昧院は、建暦元年(1211)、北条政子が夫・源頼朝の菩提を弔うため、禅定院として創建した寺院です。貞応2年(1223)には、政子の発願により源頼朝・実朝父子の菩提を弔う多宝塔などが建てられました。現存する多宝塔は国宝に指定されており、建久5年(1194)築の石山寺多宝塔に次ぐ古さで、高野山はもとより和歌山県内でも最古級の建造物とされています。尼将軍と呼ばれた政子が鎌倉から遠く離れたこの地に託した祈りの跡を、静かに、敬意をもって見学しましょう。続いては、歩いておよそ7分の金剛峯寺へ向かいましょう。",
      },
    },
    { id: kongobuji.id, data: { visitTime: t(12, 28), memo: kongobujiMemo } },
    { id: danjo.id, data: { visitTime: t(14, 23) } },
    { id: reihokan.id, data: { visitTime: t(15, 27), stayDurationMin: 55 } },
    { id: daimon.id, data: { visitTime: t(16, 32), stayDurationMin: 25 } },
  ]);

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

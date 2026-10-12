/**
 * #156の続き。企画運営の指摘(甘草屋敷が16:28着で、16:30閉館に間に合わない)
 * に対応。
 *
 * 放光寺(拝観時間9:00〜16:30、https://www.yamanashi-kankou.jp/rekitabi/
 * jisha/spot/047.html で確認)も甘草屋敷も16:30閉館のため、単純な順番の
 * 入れ替えだけでは解決しない。そこで、大泉寺→舞鶴城公園の移動を見直した:
 * 武田神社の駐車場まで歩いて戻ってから車で移動する案(徒歩14分+車10分=24分)
 * は遠回りで分かりにくいとの指摘もあったため、レンタカーは甲府駅前で
 * 午後の出発前(昼食後)に借りることにし、武田神社までは甲府駅前からバス、
 * 大泉寺から舞鶴城公園まではタクシー(この周辺は便利なバスの便が少ないため)
 * とした。あわせて昼食を75分→65分に短縮。これにより、午後の塩山方面への
 * 出発が24分早まり、甘草屋敷の滞在を16:30ちょうどに収めた(恵林寺・放光寺の
 * 閉館時刻もあわせて確認し、どちらも16:30より前に出られることを確認済み)。
 *
 * 新しい時刻(09:30〜16:30、8か所):
 * 武田神社09:30(50)→信玄ミュージアム10:23(35)→大泉寺11:10(30)→
 * 舞鶴城公園11:50(50)→昼食(甲府駅前)12:44(65)→恵林寺14:14(65)→
 * 放光寺15:24(30)→甘草屋敷16:04(26)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-156c-2c1b1d5f.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "93b04c6c-4414-4a75-9469-44a6edd18fad";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const shrine = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "武田神社" } });
  const museum = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "信玄ミュージアム" } });
  const daisenji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "大泉寺" } });
  const castle = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "舞鶴城公園" } });
  const lunch = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "甲府駅前で昼食" } });
  const erinji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "恵林寺" } });
  const hokoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "放光寺" } });
  const amacha = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "甘草屋敷" } });

  if (shrine.memo?.includes("甲府駅前からバスで")) {
    console.log("already applied, skipping");
    return;
  }

  await setDaySpotOrder(DAY1_ID, [
    {
      id: shrine.id,
      data: {
        memo: "甲府駅前からバスでおよそ8分、甲府の旅は武田神社から始まります。武田信玄・信虎・勝頼、武田氏三代が本拠とした居館「躑躅ヶ崎館」の跡地に建てられた神社で、信玄公を御祭神として祀っています。大正時代、信玄公への位階追贈をきっかけに、地元の人々の願いから建設が進み、社殿が完成したと伝えられています。境内には武田氏の時代から残る堀や土塁、石垣、古井戸などが今も見られ、当時の面影を伝えています。参道にかかる朱塗りの神橋も、社殿の完成にあわせて架けられたものです。静かに、敬意をもってお参りしましょう。参拝を終えたら、歩いて信玄ミュージアムへ向かいましょう。",
      },
    },
    { id: museum.id, data: {} },
    {
      id: daisenji.id,
      data: {
        memo: daisenji.memo?.replace(
          "参拝を終えたら、舞鶴城公園へ向かいましょう。",
          "参拝を終えたら、タクシーで舞鶴城公園へ向かいましょう。"
        ),
      },
    },
    {
      id: castle.id,
      data: {
        visitTime: T(11, 50),
        memo: castle.memo?.replace(
          "大泉寺から、武田神社の駐車場まで歩いておよそ14分戻り、そこから車でおよそ10分、次に訪れるのは舞鶴城公園です。",
          "大泉寺からタクシーでおよそ10分(このあたりは便利なバスの便が少ないため)、次に訪れるのは舞鶴城公園です。"
        ),
        transitLegs: {
          deleteMany: {},
          create: [{ orderNo: 1, transitMode: "taxi", transitDurationMin: 10 }],
        },
      },
    },
    {
      id: lunch.id,
      data: {
        visitTime: T(12, 44),
        stayDurationMin: 65,
        memo: lunch.memo?.replace(
          "ゆっくりと食事をとったら、車で恵林寺へ向かいましょう。",
          "ゆっくりと食事をとったら、甲府駅前でレンタカーを借り、車で恵林寺へ向かいましょう。"
        ),
      },
    },
    {
      id: erinji.id,
      data: { visitTime: T(14, 14) },
    },
    {
      id: hokoji.id,
      data: { visitTime: T(15, 24) },
    },
    {
      id: amacha.id,
      data: {
        visitTime: T(16, 4),
        stayDurationMin: 26,
      },
    },
  ]);

  console.log("#156続き: 大泉寺→舞鶴城公園の移動をタクシーに、昼食を65分に短縮し、午後の出発を24分早めて甘草屋敷が16:30閉館に間に合うよう修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #156の続き。企画運営の指摘(甘草屋敷に「16:00までの入館締め切り」が
 * あるかもしれない)に対応。
 *
 * 甲州市公式(city.koshu.yamanashi.jp)・山梨県観光公式サイト
 * (https://www.yamanashi-kankou.jp/kankou/spot/p1_4282.html)など、
 * 確認できたどの情報にも「開館時間9:00〜16:30」とだけあり、16:30より前の
 * 入館締め切りの記載は見当たらなかった(確定的に否定はできない)。安全を
 * 優先し、企画運営の提案どおり、甘草屋敷を先、境内の拝観である放光寺を
 * 最後に入れ替えた。
 *
 * 新しい時刻(09:30〜16:30、8か所):
 * 武田神社09:30(50)→信玄ミュージアム10:23(35)→大泉寺11:10(30)→
 * 舞鶴城公園11:50(50)→昼食(甲府駅前)12:44(65)→恵林寺14:14(65)→
 * 甘草屋敷15:29(26)→放光寺16:05(25)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-156d-2c1b1d5f.ts
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

  if (amacha.visitTime?.getUTCHours() === 15) {
    console.log("already applied, skipping");
    return;
  }

  await setDaySpotOrder(DAY1_ID, [
    { id: shrine.id, data: {} },
    { id: museum.id, data: {} },
    { id: daisenji.id, data: {} },
    { id: castle.id, data: {} },
    { id: lunch.id, data: {} },
    { id: erinji.id, data: { memo: erinji.memo?.replace("見学を終えたら、車で放光寺へ向かいましょう。", "見学を終えたら、車で甘草屋敷へ向かいましょう。") } },
    {
      id: amacha.id,
      data: {
        visitTime: T(15, 29),
        stayDurationMin: 26,
        memo: "恵林寺から車でおよそ10分、次に訪れるのは甘草屋敷です。正式には旧高野家住宅といい、江戸時代、漢方薬の原料となる甘草を栽培し、幕府に納めていた家です。兜のような形の急な茅葺き屋根が特徴の「兜造り」という建築様式で、国の重要文化財に指定されています。蔵や庭には、季節の花々も植えられています。見学を終えたら、車で放光寺へ向かいましょう。",
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10 }] },
      },
    },
    {
      id: hokoji.id,
      data: {
        visitTime: T(16, 5),
        stayDurationMin: 25,
        memo: "甘草屋敷から車でおよそ10分、甲府の旅の最後に訪れるのは放光寺です。寿永3年(1184)、安田義定によって開かれた真言宗の寺で、戦国時代には武田信玄の祈願所となりました。武田勝頼が奉納したと伝わる大般若経は、天正10年(1582)の武田氏滅亡の際、織田軍によって多くが失われました。「花の寺」としても親しまれ、梅や桜、牡丹、紅葉など、四季折々の花木が境内を彩ります。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。見学を終えたら、車でおよそ30分、甲府駅前のレンタカー営業所へ戻り、返却してから帰りましょう。",
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10 }] },
      },
    },
  ]);

  console.log("#156続き: 甘草屋敷と放光寺の順番を入れ替え(甘草屋敷を先に、境内拝観の放光寺を最後に)。09:30〜16:30");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

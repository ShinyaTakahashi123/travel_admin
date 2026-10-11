/**
 * #156の続き。企画運営の3点・法務の2点の指摘に対応。
 * 企画運営:
 * ①車の借り方・止め方を時刻と合わせて明記。甲府駅前でレンタカーを借り、
 *   武田神社の駐車場に車を止める。大泉寺からは、武田神社の駐車場まで
 *   歩いて戻ってから車で舞鶴城公園へ向かう(徒歩14分+車10分の2区間)。
 *   最後は甘草屋敷から甲府駅前のレンタカー営業所へ戻り返却する。
 * ②恵林寺を95分→65分に短縮し、空いた時間に甘草屋敷(旧高野家住宅、
 *   国指定重要文化財の兜造り民家)を追加(ほかのしおりとの重なりなしを
 *   確認済み)。
 * ③恵林寺の信玄公の墓所「ふだんは非公開」は
 *   https://www.jeepe.jp/ja/articles/erinji-temple-guide-2407 で
 *   「武田信玄公の墓所は通常非公開です」と確認できたため、そのまま残した。
 * 法務:
 * ①恵林寺の快川紹喜の最期のくだり(亡くなり方の場面)を削除し、建物が
 *   焼き討ちで失われ、のちに再建されたという話に直した。
 * ②恵林寺・放光寺の結びを、祈りの決まった一文
 *   「今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。」
 *   に統一。
 *
 * 新しい時刻(09:30〜16:58、8か所):
 * 武田神社09:30(50)→信玄ミュージアム10:23(35)→大泉寺11:10(30)→
 * 舞鶴城公園12:04(50)→昼食(甲府駅前)12:58(75)→恵林寺14:38(65)→
 * 放光寺15:48(30)→甘草屋敷16:28(30)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-156b-2c1b1d5f.ts
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

  if (shrine.memo?.includes("甲府駅前でレンタカーを借り")) {
    console.log("already applied, skipping");
    return;
  }

  await setDaySpotOrder(DAY1_ID, [
    {
      id: shrine.id,
      data: {
        memo: "甲府駅前でレンタカーを借り、車でおよそ10分、甲府の旅は武田神社から始まります。駐車場に車を止めて、歩いて参拝しましょう。武田信玄・信虎・勝頼、武田氏三代が本拠とした居館「躑躅ヶ崎館」の跡地に建てられた神社で、信玄公を御祭神として祀っています。大正時代、信玄公への位階追贈をきっかけに、地元の人々の願いから建設が進み、社殿が完成したと伝えられています。境内には武田氏の時代から残る堀や土塁、石垣、古井戸などが今も見られ、当時の面影を伝えています。参道にかかる朱塗りの神橋も、社殿の完成にあわせて架けられたものです。静かに、敬意をもってお参りしましょう。参拝を終えたら、歩いて信玄ミュージアムへ向かいましょう。",
      },
    },
    { id: museum.id, data: {} },
    {
      id: daisenji.id,
      data: {
        memo: daisenji.memo?.replace(
          "参拝を終えたら、車に戻り、舞鶴城公園へ向かいましょう。",
          "参拝を終えたら、舞鶴城公園へ向かいましょう。"
        ),
      },
    },
    {
      id: castle.id,
      data: {
        visitTime: T(12, 4),
        memo: castle.memo?.replace(
          "大泉寺から車でおよそ10分、次に訪れるのは舞鶴城公園です。",
          "大泉寺から、武田神社の駐車場まで歩いておよそ14分戻り、そこから車でおよそ10分、次に訪れるのは舞鶴城公園です。"
        ),
        transitLegs: {
          deleteMany: {},
          create: [
            { orderNo: 1, transitMode: "walk", transitDurationMin: 14 },
            { orderNo: 2, transitMode: "car", transitDurationMin: 10 },
          ],
        },
      },
    },
    {
      id: lunch.id,
      data: { visitTime: T(12, 58) },
    },
    {
      id: erinji.id,
      data: {
        visitTime: T(14, 38),
        stayDurationMin: 65,
        memo: "甲府駅前から車でおよそ25分、次に訪れるのは恵林寺です。元徳2年(1330)、夢窓国師によって開かれた臨済宗の古刹で、のちに武田信玄が菩提寺と定めました。天正10年(1582)、織田軍の焼き討ちで伽藍を失いましたが、のちに再建されました。国の重要文化財・四脚門や、夢窓国師の作と伝わる庭園、歩くとうぐいすの鳴き声のような音が響く「うぐいす廊下」も見どころです。信玄公の墓所もありますが、ふだんは非公開となっています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。見学を終えたら、車で放光寺へ向かいましょう。",
      },
    },
    {
      id: hokoji.id,
      data: {
        visitTime: T(15, 48),
        memo: "恵林寺から車でおよそ5分、次に訪れるのは放光寺です。寿永3年(1184)、安田義定によって開かれた真言宗の寺で、戦国時代には武田信玄の祈願所となりました。武田勝頼が奉納したと伝わる大般若経は、天正10年(1582)の武田氏滅亡の際、織田軍によって多くが失われました。「花の寺」としても親しまれ、梅や桜、牡丹、紅葉など、四季折々の花木が境内を彩ります。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。見学を終えたら、車で甘草屋敷へ向かいましょう。",
      },
    },
    {
      create: {
        name: "甘草屋敷",
        address: "甲州市塩山上於曽",
        lat: 35.7063514,
        lng: 138.7347815,
        visitTime: T(16, 28),
        stayDurationMin: 30,
        memo: "放光寺から車でおよそ10分、甲府の旅の最後に訪れるのは甘草屋敷です。正式には旧高野家住宅といい、江戸時代、漢方薬の原料となる甘草を栽培し、幕府に納めていた家です。兜のような形の急な茅葺き屋根が特徴の「兜造り」という建築様式で、国の重要文化財に指定されています。蔵や庭には、季節の花々も植えられています。見学を終えたら、車でおよそ30分、甲府駅前のレンタカー営業所へ戻り、返却してから帰りましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10 }] },
      },
    },
  ]);

  console.log("#156続き: 車の借り方・止め方を明記、恵林寺65分に短縮し甘草屋敷を追加、快川紹喜の最期の場面を削除、祈りの一文を統一。09:30〜16:58に組み直し");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

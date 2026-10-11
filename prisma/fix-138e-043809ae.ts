/**
 * #138 043809aeの直し(5回目)。企画運営の指摘。
 * やちむんの里117分(決まりAの水増し)を70〜80分に短縮し、空いた時間は
 * 道の駅かでなと浦添の間に嘉数高台公園(沖縄戦で最初の防衛線の中心、
 * 展望台・陣地壕)を新設して埋める。夏季限定のしおりのため「毎年12月の
 * 陶器市」の一文も削除。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const YACHIMUN_MEMO =
  "座喜味城跡から車でおよそ3分、やちむんの里に着きます。沖縄初の人間国宝として知られる陶工・金城次郎が、この地に登り窯「金城次郎窯」を構えたことをきっかけに、多くの陶工が集まるようになりました。昭和55年(1980)には、名工4人が共同で9連の登り窯「読谷山焼窯」を築き、「やちむんの里」と呼ばれるようになったと伝えられています。工房は一つずつ違う窯元が営んでいるので、見学できる時間はそれぞれ異なります。訪れる前に、公式の案内で確かめましょう。木々に囲まれた散策路を歩きながら、工房を一つずつのぞいてみましょう。このあたりには食事処もあるので、昼食をとりましょう。作業の邪魔にならないよう、静かに見て回りましょう。この後は、車でおよそ9分、道の駅かでなへ向かいましょう。";

const KADENA_MEMO =
  "やちむんの里から車でおよそ9分、道の駅かでなに着きます。嘉手納基地の離着陸の様子を展望台から見ることができる施設で、平成15年(2003)に開館しました。4階の展望場からは米軍の飛行場を一望でき、3階の学習展示室では、町の面積の多くを基地が占める嘉手納町の歴史を学ぶこともできます。静かに見学しましょう。この後は、車でおよそ19分、嘉数高台公園へ向かいましょう。";

const KAKAZU_MEMO =
  "道の駅かでなから車でおよそ19分、嘉数高台公園に着きます。沖縄戦で最初の防衛線の中心となった高台で、アメリカ軍が上陸後に初めて激しい抵抗を受けた場所の一つと伝えられています。地球の形をした展望台からは、残波岬や慶良間諸島まで見渡せ、普天間基地の様子を望むこともできます。園内には、当時の陣地壕の一部も残っています。静かに見学しましょう。この後は、車でおよそ3分、浦添グスク・ようどれ館へ向かいましょう。";

const URASOE_FROM_OPENER = "道の駅かでなから車でおよそ22分、浦添グスク・ようどれ館に着きます。";
const URASOE_TO_OPENER = "嘉数高台公園から車でおよそ3分、浦添グスク・ようどれ館に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '043809ae%'`);
  const itinId = rows[0].id;
  const kadena = await findSpotInItinerary(itinId, { spotName: "道の駅かでな" });
  const urasoe = await findSpotInItinerary(itinId, { spotName: "浦添グスク・ようどれ館" });

  if (!urasoe.memo?.includes(URASOE_FROM_OPENER)) throw new Error("浦添の文言が想定外です");

  console.log("dayId:", kadena.dayId);
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    const day2: SpotOrderItem[] = [
      { id: (await findSpotInItinerary(itinId, { spotName: "真栄田岬 岬の上" })).id, data: {} },
      { id: (await findSpotInItinerary(itinId, { spotName: "座喜味城跡" })).id, data: {} },
      {
        id: (await findSpotInItinerary(itinId, { spotName: "やちむんの里" })).id,
        data: { visitTime: t(11, 48), stayDurationMin: 75, memo: YACHIMUN_MEMO },
      },
      {
        id: kadena.id,
        data: { visitTime: t(13, 12), stayDurationMin: 45, memo: KADENA_MEMO },
      },
      {
        create: {
          name: "嘉数高台公園", lat: 26.258677, lng: 127.7364818, visitTime: t(14, 16), stayDurationMin: 41, memo: KAKAZU_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 19 }] },
        },
      },
      {
        id: urasoe.id,
        data: {
          visitTime: t(15, 0),
          memo: urasoe.memo!.replace(URASOE_FROM_OPENER, URASOE_TO_OPENER),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 3 }] },
        },
      },
    ];
    await setDaySpotOrder(kadena.dayId, day2, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

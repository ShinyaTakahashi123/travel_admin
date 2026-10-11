/**
 * #133 dba1a628の直し(4回目)。
 * ・企画運営: 長谷駅のまわり(昼食)85分を60分に短縮し、空いた時間に
 *   成就院のすぐ先の虚空蔵堂(星井寺、成就院の境外仏、5d898384の極楽寺とは
 *   別の場所・未使用を確認済み)を追加
 * ・法務: 小町通りの「鎌倉でもっとも賑やかな通りです」にぼかしを追加
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KOMACHI_FROM = "鎌倉でもっとも賑やかな通りです。";
const KOMACHI_TO = "鎌倉でもっとも賑やかな通りの一つとされます。";

const HASEEKI_MEMO =
  "長谷寺から歩いておよそ5分、長谷駅のまわりに着きます。江ノ電長谷駅の周辺には、食事処やしらす料理の店、和菓子店などが並んでいます。ここで昼食をとりましょう。食事を終えたら、歩いておよそ5分、御霊神社へ向かいましょう。";

const JOJU_MEMO =
  "御霊神社から歩いておよそ4分、成就院に着きます。承久元年(1219)、鎌倉幕府3代執権・北条泰時が、空海(弘法大師)が平安時代にこの地で修行したという伝承に基づいて開いたと伝えられる寺です。極楽寺坂切通のそばにあり、縁結びの寺として親しまれています。石段の参道からは、由比ヶ浜を見渡す眺めが広がります。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ2分、虚空蔵堂へ向かいましょう。";

const KOKUZODO_MEMO =
  "成就院から歩いておよそ2分、虚空蔵堂に着きます。すぐそばには、鎌倉十井の一つ「星の井」があり、昼間でも井戸の水面に明けの明星が映ったことがその名の由来と伝えられています。この井戸で虚空蔵菩薩の姿を見たという行基が、自ら像を彫って堂を建てたのが始まりとされ、今は成就院の境外仏となっています。本尊は長く秘仏とされてきましたが、今は毎年1月に御開帳が行われています。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ31分、銭洗弁財天宇賀福神社へ向かいましょう。";

const ZENIARAI_MEMO =
  "虚空蔵堂から歩いておよそ31分、銭洗弁財天宇賀福神社に着きます。文治元年(1185)、源頼朝の夢に、人の頭と蛇の体を持つ水神・宇賀福神が現れ、「この地に湧く水で神仏を供養すれば天下が治まる」とのお告げを受けたことから、社を建てたのが始まりと伝えられています。正嘉元年(1257)には、5代執権・北条時頼が、このお告げの水でお金を洗い、一族の繁栄を祈願したことから、「銭洗い」の風習が始まったといわれています。奥宮の洞窟に湧く「銭洗水」は鎌倉五名水の一つに数えられ、この水でお金を洗うと福を招くと伝えられ、多くの参拝者が訪れます。静かに、敬意を持ってお参りしましょう。参拝を終えたら、歩いておよそ20分、鎌倉駅へ戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'dba1a628%'`);
  const itinId = rows[0].id;

  const komachi = await findSpotInItinerary(itinId, { spotName: "小町通り" });
  const amanawa = await findSpotInItinerary(itinId, { spotName: "甘縄神明神社" });
  const kotokuin = await findSpotInItinerary(itinId, { spotName: "高徳院（鎌倉大仏）" });
  const hasedera = await findSpotInItinerary(itinId, { spotName: "長谷寺" });
  const haseeki = await findSpotInItinerary(itinId, { spotName: "長谷駅のまわり" });
  const goryo = await findSpotInItinerary(itinId, { spotName: "御霊神社" });
  const joju = await findSpotInItinerary(itinId, { spotName: "成就院" });
  const zeniarai = await findSpotInItinerary(itinId, { spotName: "銭洗弁財天宇賀福神社" });

  if (!komachi.memo?.includes(KOMACHI_FROM)) throw new Error("小町通りの文言が想定外です");

  console.log("day2:", haseeki.dayId);
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.spot.update({
      where: { id: komachi.id },
      data: { memo: komachi.memo!.replace(KOMACHI_FROM, KOMACHI_TO) },
    });

    const day2: SpotOrderItem[] = [
      { id: amanawa.id, data: {} },
      { id: kotokuin.id, data: {} },
      { id: hasedera.id, data: {} },
      {
        id: haseeki.id,
        data: {
          visitTime: t(12, 33),
          stayDurationMin: 60,
          memo: HASEEKI_MEMO,
        },
      },
      {
        id: goryo.id,
        data: {
          visitTime: t(13, 38),
          stayDurationMin: 35,
        },
      },
      {
        id: joju.id,
        data: {
          visitTime: t(14, 17),
          stayDurationMin: 35,
          memo: JOJU_MEMO,
        },
      },
      {
        create: {
          name: "虚空蔵堂",
          lat: 35.3097597,
          lng: 139.5326576,
          visitTime: t(14, 54),
          stayDurationMin: 25,
          memo: KOKUZODO_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
        },
      },
      {
        id: zeniarai.id,
        data: {
          visitTime: t(15, 50),
          stayDurationMin: 40,
          memo: ZENIARAI_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 31 }] },
        },
      },
    ];
    await setDaySpotOrder(haseeki.dayId, day2, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

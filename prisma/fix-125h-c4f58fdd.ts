/**
 * #125 c4f58fddの直し(8回目)。企画運営(2026-10-11)・法務(2026-10-11、
 * 記録40c963d)の指摘。
 *
 * 企画運営:
 * 1. アルパこまくさの滞在180分は決まりA違反(時間を埋めるための長い滞在)。
 *    90分に短縮し、空いた時間に実在の行き先「たつこの鏡岩」(御座石神社
 *    から山道を230段ほど登った先にある、辰子姫が鏡にしたと伝わる岩。
 *    tabi-mag.jp/ak0068/で確認)を追加。
 * 2. Day1に昼食の一文がなかったため、姫観音像に「田沢湖の湖畔には
 *    食事処もあるので、ここで昼食にしましょう」を追加(湖畔のレストラン
 *    の実在を確認)。
 *
 * 法務: アルパこまくさで日帰り入浴を勧めているが入浴の一文がなかった
 *    ため、乳頭温泉郷と同じ決まりの一文を追加。
 *
 * 座標: たつこの鏡岩 39.7548288, 140.6476148(OSM node 7812263125)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const GOZAISHI_FROM = "この後は、車でおよそ8分、姫観音像へ向かいましょう。";
const GOZAISHI_TO = "この後は、境内から山道を歩いておよそ15分、たつこの鏡岩へ向かいましょう。";

const KAGAMIIWA_MEMO =
  "御座石神社の境内から、山道を歩いておよそ15分(230段ほどの木の階段)、たつこの鏡岩に着きます。辰子姫が山菜採りをしていたころ、化粧をする際に鏡として使ったと伝えられる岩で、むき出しになった巨岩に、直径75cmほどの六角形の石がはめ込まれています。階段の上には湖を見渡せるテラスもあるので、少し休みながら景色を楽しみましょう。足元が滑りやすい場所もあるので、気をつけて歩きましょう。この後は、山道を下りて車でおよそ20分、姫観音像へ向かいましょう。";

const HIME_OPENER_FROM = "御座石神社から車でおよそ8分、姫観音像に着きます。";
const HIME_OPENER_TO = "たつこの鏡岩から車でおよそ20分、姫観音像に着きます。";
const HIME_FROM = "湖に向かって静かに立つ像を見ながら、少し足を止めましょう。この先の田沢湖高原には食事処もあるので、昼食をとってから向かうのもよいでしょう。";
const HIME_TO =
  "湖に向かって静かに立つ像を見ながら、少し足を止めましょう。田沢湖の湖畔には食事処もあるので、ここで昼食にしましょう。";

const ALPA_FROM = "日帰り入浴もできるので、ここでひと休みしましょう。この後は、車でおよそ15分、乳頭温泉郷へ向かいましょう。";
const ALPA_TO =
  "日帰り入浴もできるので、ここでひと休みしましょう。入浴の際は、ほかの入浴客を写真に撮ったりせず、長湯をしすぎないよう気をつけ、こまめに水分をとりましょう。この後は、車でおよそ25分、乳頭温泉郷へ向かいましょう。";

const NYUTO_FROM = "アルパこまくさから車でおよそ15分、乳頭山の山麓に広がる乳頭温泉郷に着きます。";
const NYUTO_TO = "アルパこまくさから車でおよそ25分、乳頭山の山麓に広がる乳頭温泉郷に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c4f58fdd%'`);
  const itinId = rows[0].id;

  const tatsuko = await findSpotInItinerary(itinId, { spotName: "たつこ像" });
  const gozaishi = await findSpotInItinerary(itinId, { spotName: "御座石神社" });
  const hime = await findSpotInItinerary(itinId, { spotName: "姫観音像" });
  const alpa = await findSpotInItinerary(itinId, { spotName: "アルパこまくさ" });
  const nyuto = await findSpotInItinerary(itinId, { dayNumber: 1, spotName: "乳頭温泉郷" });

  if (!gozaishi.memo?.includes(GOZAISHI_FROM)) throw new Error("御座石神社の文言が想定外です");
  if (!hime.memo?.includes(HIME_OPENER_FROM) || !hime.memo?.includes(HIME_FROM)) throw new Error("姫観音像の文言が想定外です");
  if (!alpa.memo?.includes(ALPA_FROM)) throw new Error("アルパこまくさの文言が想定外です");
  if (!nyuto.memo?.includes(NYUTO_FROM)) throw new Error("乳頭温泉郷の文言が想定外です");

  console.log("確認OK。Day1 dayId:", gozaishi.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const items: SpotOrderItem[] = [
    { id: tatsuko.id, data: {} },
    { id: gozaishi.id, data: { memo: gozaishi.memo!.replace(GOZAISHI_FROM, GOZAISHI_TO), visitTime: t(9, 50) } },
    {
      create: {
        name: "たつこの鏡岩",
        memo: KAGAMIIWA_MEMO,
        lat: 39.7548288,
        lng: 140.6476148,
        visitTime: t(11, 5),
        stayDurationMin: 55,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15, transitLine: null }] },
      },
    },
    {
      id: hime.id,
      data: {
        memo: hime.memo!.replace(HIME_OPENER_FROM, HIME_OPENER_TO).replace(HIME_FROM, HIME_TO),
        visitTime: t(12, 20),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 20, transitLine: null }] },
      },
    },
    {
      id: alpa.id,
      data: {
        memo: alpa.memo!.replace(ALPA_FROM, ALPA_TO),
        visitTime: t(14, 0),
        stayDurationMin: 90,
      },
    },
    {
      id: nyuto.id,
      data: {
        memo: nyuto.memo!.replace(NYUTO_FROM, NYUTO_TO),
        visitTime: t(15, 55),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 25, transitLine: null }] },
      },
    },
  ];
  await setDaySpotOrder(gozaishi.dayId, items, {});

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

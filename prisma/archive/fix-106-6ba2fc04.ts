/**
 * #106 6ba2fc04 日本三景・天橋立を股のぞきで楽しむ丹後さんぽプラン。
 * チェックリスト(20260929-itinerary-4spots-9to16)の決まりに合わせて組み直す。
 * 元は5か所(09:00〜16:00)で終了が16:30〜17:00に届いていなかった。既存の
 * 内容はすでに実在の事実にもとづく落ち着いた書き方だったため、水増しせず、
 * 実在の新しい行き先・ちりめん街道(重要伝統的建造物群保存地区)を加悦鉄道
 * 資料館のあとに追加して埋めた。あわせて、どのスポットにも昼食の一言が
 * なかったため、丹後由良に追加した。
 *
 * 新規に追加したスポットの座標(Nominatim名前検索で確認):
 * - ちりめん街道: 35.5035949,135.0920876
 *
 * 開いたURL(事実確認):
 * - ちりめん街道(丹後ちりめんの流通拠点・1722年に西陣の技術を持ち帰る・重要伝統的建造物群保存地区): https://ja.wikipedia.org/wiki/%E3%81%A1%E3%82%8A%E3%82%81%E3%82%93%E8%A1%97%E9%81%93
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const YURA_FROM = "静かな渚を歩きながら、悲しくも美しい物語に思いをはせてみましょう。";
const YURA_TO = "静かな渚を歩きながら、悲しくも美しい物語に思いをはせてみましょう。ここで昼食にしましょう。";

const KAYA_FROM = "ボランティアの手で大切に守られてきた鉄道の歴史に、日帰り旅の締めくくりとして触れてみましょう。";
const KAYA_TO = "ボランティアの手で大切に守られてきた鉄道の歴史に触れてみましょう。この後は、歩いておよそ5分、ちりめん街道へ向かいましょう。";

const CHIRIMEN_MEMO =
  "加悦鉄道資料館から歩いておよそ5分、ちりめん街道に着きます。丹後ちりめんと京都を結ぶ流通の拠点として栄えた町並みで、明治・大正・昭和にかけて建てられた織物工場や土蔵、町家が今も軒を連ねています。享保7年(1722)、京都・西陣で学んだ技術が加悦に持ち帰られたのが、丹後ちりめんの始まりと伝えられています。重要伝統的建造物群保存地区に指定された通りを歩きながら、ちりめん産業で栄えた町の面影を感じてみましょう。日本三景・天橋立を股のぞきで楽しむ丹後さんぽはこれで終わりです。帰りは、与謝野町内から、京都丹後鉄道の最寄り駅方面へお戻りください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6ba2fc04%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const kasamatsu = await findSpotInItinerary(itinId, { spotName: "傘松公園" });
  const ine = await findSpotInItinerary(itinId, { spotName: "伊根の舟屋" });
  const yura = await findSpotInItinerary(itinId, { spotName: "丹後由良" });
  const amanohashidate = await findSpotInItinerary(itinId, { spotName: "天橋立" });
  const kaya = await findSpotInItinerary(itinId, { spotName: "旧加悦鉄道加悦駅舎（加悦鉄道資料館）" });

  if (!yura.memo!.includes(YURA_FROM)) throw new Error("丹後由良の文言が想定外です");
  if (!kaya.memo!.includes(KAYA_FROM)) throw new Error("加悦鉄道資料館の文言が想定外です");

  const yuraMemo = yura.memo!.replace(YURA_FROM, YURA_TO);
  const kayaMemo = kaya.memo!.replace(KAYA_FROM, KAYA_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: kasamatsu.id, data: {} },
    { id: ine.id, data: {} },
    { id: yura.id, data: { memo: yuraMemo } },
    { id: amanohashidate.id, data: {} },
    { id: kaya.id, data: { memo: kayaMemo } },
    {
      create: {
        name: "ちりめん街道",
        address: "京都府与謝郡与謝野町加悦",
        lat: 35.5035949,
        lng: 135.0920876,
        memo: CHIRIMEN_MEMO,
        visitTime: t(16, 5),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
  ];

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

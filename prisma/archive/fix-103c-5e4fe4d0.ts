/**
 * #103 5e4fe4d0 の直し(3回目)。企画運営(2026-10-01 09:20)の指摘:
 * 東尋坊200分は決まりAの水増し(遊覧船を入れても90分くらいが妥当)。
 * 90分にし、空いた時間は新しい実在の行き先・瀧谷寺(真言宗智山派、国宝の
 * 金銅宝相華文磬・6棟の重要文化財建造物・国指定名勝庭園)を吉崎御坊と
 * 東尋坊の間に追加して埋めた。
 *
 * 新規に追加したスポットの座標(Nominatim名前検索で確認):
 * - 瀧谷寺: 36.2212186,136.146207
 *
 * 開いたURL(事実確認):
 * - 瀧谷寺(1375年開山・国宝金銅宝相華文磬・重要文化財6棟・国指定名勝庭園): https://ja.wikipedia.org/wiki/%E7%80%A7%E8%B0%B7%E5%AF%BA
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const YOSHIZAKI_FROM = "参拝の際は、敬意を込めて手を合わせましょう。この後は、車でおよそ25分、東尋坊へ向かいましょう。";
const YOSHIZAKI_TO = "参拝の際は、敬意を込めて手を合わせましょう。この後は、車でおよそ22分、瀧谷寺へ向かいましょう。";

const TAKIDANJI_MEMO =
  "吉崎御坊から車でおよそ22分、瀧谷寺に着きます。真言宗智山派の寺院で、山号は摩尼宝山、本尊は薬師如来です。永和元年(1375)、睿憲によって開かれたと伝わります。本堂や観音堂、山門、鎮守堂など6棟が国の重要文化財に指定され、唐の時代に作られたと伝わる金銅宝相華文磬は国宝に指定されています。江戸時代に築かれた庭園は、丘陵の地形を生かした山水式庭園で、昭和4年(1929)、福井県内では最初に指定されたとされる国の名勝です。参拝の際は、敬意を込めて手を合わせましょう。この後は、車でおよそ7分、東尋坊へ向かいましょう。";

const TOJINBO_FROM = "吉崎御坊から車でおよそ25分、この旅の締めくくり、東尋坊に着きます。";
const TOJINBO_TO = "瀧谷寺から車でおよそ7分、この旅の締めくくり、東尋坊に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5e4fe4d0%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const yunomachi = await findSpotInItinerary(itinId, { spotName: "あわら湯のまち広場" });
  const fujino = await findSpotInItinerary(itinId, { spotName: "藤野厳九郎記念館" });
  const kanazu = await findSpotInItinerary(itinId, { spotName: "金津創作の森" });
  const yoshizaki = await findSpotInItinerary(itinId, { spotName: "吉崎御坊" });
  const tojinbo = await findSpotInItinerary(itinId, { spotName: "東尋坊" });

  if (!yoshizaki.memo!.includes(YOSHIZAKI_FROM)) throw new Error("吉崎御坊の文言が想定外です");
  if (!tojinbo.memo!.includes(TOJINBO_FROM)) throw new Error("東尋坊の文言が想定外です");

  const yoshizakiMemo = yoshizaki.memo!.replace(YOSHIZAKI_FROM, YOSHIZAKI_TO);
  const tojinboMemo = tojinbo.memo!.replace(TOJINBO_FROM, TOJINBO_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: yunomachi.id, data: {} },
    { id: fujino.id, data: {} },
    { id: kanazu.id, data: {} },
    { id: yoshizaki.id, data: { memo: yoshizakiMemo } },
    {
      create: {
        name: "瀧谷寺",
        address: "福井県坂井市三国町滝谷",
        lat: 36.2212186,
        lng: 136.146207,
        memo: TAKIDANJI_MEMO,
        visitTime: t(13, 19),
        stayDurationMin: 100,
        transitMode: "car",
        transitDurationMin: 22,
        transitLine: null,
      },
    },
    { id: tojinbo.id, data: { memo: tojinboMemo, visitTime: t(15, 6), stayDurationMin: 90, transitMode: "car", transitDurationMin: 7, transitLine: null } },
  ];

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

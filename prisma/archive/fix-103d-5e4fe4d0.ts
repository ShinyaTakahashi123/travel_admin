/**
 * #103 5e4fe4d0 の直し(4回目)。企画運営(2026-10-01 10:11)の指摘:
 * 新しく足した瀧谷寺100分も水増し(お寺の庭と本堂で40分くらいが妥当)。
 * 40分にし、空いた時間は、さらに新しい実在の行き先・みくに龍翔館(北前船で
 * 栄えた三国の歴史を伝える資料館、明治12年建築の龍翔小学校を復元した
 * 五層八角形の洋館)を瀧谷寺と東尋坊の間に追加して埋めた(時間を延ばすの
 * ではなく、行き先を足す形)。
 *
 * 新規に追加したスポットの座標(Nominatim名前検索で確認):
 * - みくに龍翔館: 36.2198953,136.151427
 *
 * 開いたURL(事実確認):
 * - みくに龍翔館(1981年開館・エッシャー設計の龍翔小学校を復元・2023年リニューアル): https://ja.wikipedia.org/wiki/%E3%81%BF%E3%81%8F%E3%81%AB%E9%BE%8D%E7%BF%94%E9%A4%A8
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TAKIDANJI_FROM = "この後は、車でおよそ7分、東尋坊へ向かいましょう。";
const TAKIDANJI_TO = "この後は、車でおよそ9分、みくに龍翔館へ向かいましょう。";

const RYUSHOKAN_MEMO =
  "瀧谷寺から車でおよそ9分、みくに龍翔館に着きます。日本海を望む丘の上に建つ、白壁の五層八角形が印象的な洋風建築です。オランダ人技師エッシャーが設計し、明治12年(1879)に建てられた龍翔小学校の姿を、忠実に復元したものです。北前船交易で栄えた三国の歴史を中心に、港町の文化や暮らしを紹介する資料館で、令和5年(2023)には「坂井市龍翔博物館」としてリニューアルしました。この後は、車でおよそ8分、東尋坊へ向かいましょう。";

const TOJINBO_FROM = "瀧谷寺から車でおよそ7分、この旅の締めくくり、東尋坊に着きます。";
const TOJINBO_TO = "みくに龍翔館から車でおよそ8分、この旅の締めくくり、東尋坊に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5e4fe4d0%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const yunomachi = await findSpotInItinerary(itinId, { spotName: "あわら湯のまち広場" });
  const fujino = await findSpotInItinerary(itinId, { spotName: "藤野厳九郎記念館" });
  const kanazu = await findSpotInItinerary(itinId, { spotName: "金津創作の森" });
  const yoshizaki = await findSpotInItinerary(itinId, { spotName: "吉崎御坊" });
  const takidanji = await findSpotInItinerary(itinId, { spotName: "瀧谷寺" });
  const tojinbo = await findSpotInItinerary(itinId, { spotName: "東尋坊" });

  if (!takidanji.memo!.includes(TAKIDANJI_FROM)) throw new Error("瀧谷寺の文言が想定外です");
  if (!tojinbo.memo!.includes(TOJINBO_FROM)) throw new Error("東尋坊の文言が想定外です");

  const takidanjiMemo = takidanji.memo!.replace(TAKIDANJI_FROM, TAKIDANJI_TO);
  const tojinboMemo = tojinbo.memo!.replace(TOJINBO_FROM, TOJINBO_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: yunomachi.id, data: {} },
    { id: fujino.id, data: {} },
    { id: kanazu.id, data: {} },
    { id: yoshizaki.id, data: {} },
    { id: takidanji.id, data: { memo: takidanjiMemo, stayDurationMin: 40 } },
    {
      create: {
        name: "みくに龍翔館",
        address: "福井県坂井市三国町緑ケ丘",
        lat: 36.2198953,
        lng: 136.151427,
        memo: RYUSHOKAN_MEMO,
        visitTime: t(14, 8),
        stayDurationMin: 50,
        transitMode: "car",
        transitDurationMin: 9,
        transitLine: null,
      },
    },
    { id: tojinbo.id, data: { memo: tojinboMemo, visitTime: t(15, 6), transitMode: "car", transitDurationMin: 8, transitLine: null } },
  ];

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

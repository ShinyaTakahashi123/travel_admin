/**
 * #97 3993afce の直し(7回目)。企画運営(2026-10-01 10:11)の指摘:
 * 新しく足した長浜びわこ大仏100分も水増し(大仏の前で20〜30分が妥当)。
 * 25分にし、空いた時間は、さらに新しい実在の行き先・ヤンマーミュージアム
 * (長浜出身の山岡孫吉が興したヤンマーの企業博物館)を豊公園とびわこ大仏の
 * 間に追加して埋めた(時間を延ばすのではなく、新しい行き先を足す形)。
 *
 * 新規に追加したスポットの座標(Nominatim名前検索で確認):
 * - ヤンマーミュージアム: 35.37427,136.270202
 *
 * 開いたURL(事実確認):
 * - ヤンマーミュージアム(山岡孫吉1888〜1962・1933年完成の小型ディーゼルエンジン): https://www.nikkei.com/article/DGXMZO57216240V20C20A3AA1P00/
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const HOKO_FROM = "この後は、車でおよそ8分、長浜びわこ大仏へ向かいましょう。";
const HOKO_TO = "この後は、車でおよそ8分、ヤンマーミュージアムへ向かいましょう。";

const YANMAR_MEMO =
  "豊公園から車でおよそ8分、ヤンマーミュージアムに着きます。長浜出身の発明家・山岡孫吉(1888〜1962)が興したヤンマーの企業ミュージアムです。山岡は、農作業の重労働を少しでも減らしたいという思いから、エンジンの小型化に取り組み、昭和8年(1933)、世界で初めて実用的な小型横形水冷ディーゼルエンジン「HB形」を完成させたとされています。実際に動く仕組みを体感できる展示や、農業や漁業の現場を支えてきた機械の数々を見ることができます。この後は、車でおよそ10分、長浜びわこ大仏へ向かいましょう。";

const BIWAKODAIBUTSU_FROM = "豊公園から車でおよそ8分、長浜びわこ大仏に着きます。";
const BIWAKODAIBUTSU_TO = "ヤンマーミュージアムから車でおよそ10分、長浜びわこ大仏に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '3993afce%'`);
  const itinId = rows[0].id;
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const keiunkan = await findSpotInItinerary(itinId, { spotName: "慶雲館" });
  const tetsudo = await findSpotInItinerary(itinId, { spotName: "長浜鉄道スクエア" });
  const chikubu = await findSpotInItinerary(itinId, { spotName: "竹生島" });
  const castle = await findSpotInItinerary(itinId, { spotName: "長浜城歴史博物館" });
  const hoko = await findSpotInItinerary(itinId, { spotName: "豊公園" });
  const daibutsu = await findSpotInItinerary(itinId, { spotName: "長浜びわこ大仏" });

  if (!hoko.memo!.includes(HOKO_FROM)) throw new Error("豊公園の文言が想定外です");
  if (!daibutsu.memo!.includes(BIWAKODAIBUTSU_FROM)) throw new Error("長浜びわこ大仏の文言が想定外です");

  const hokoMemo = hoko.memo!.replace(HOKO_FROM, HOKO_TO);
  const daibutsuMemo = daibutsu.memo!.replace(BIWAKODAIBUTSU_FROM, BIWAKODAIBUTSU_TO);

  const day2Spots: SpotOrderItem[] = [
    { id: keiunkan.id, data: {} },
    { id: tetsudo.id, data: {} },
    { id: chikubu.id, data: {} },
    { id: castle.id, data: {} },
    { id: hoko.id, data: { memo: hokoMemo } },
    {
      create: {
        name: "ヤンマーミュージアム",
        address: "滋賀県長浜市三和町",
        lat: 35.37427,
        lng: 136.270202,
        memo: YANMAR_MEMO,
        visitTime: t(14, 58),
        stayDurationMin: 58,
        transitMode: "car",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
    { id: daibutsu.id, data: { memo: daibutsuMemo, visitTime: t(16, 6), stayDurationMin: 25, transitMode: "car", transitDurationMin: 10, transitLine: null } },
  ];

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

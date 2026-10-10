/**
 * #104 62d86c73 の直し(2回目)。企画運営(2026-10-01 09:20)の指摘:
 * 岡山後楽園215分は決まりAの水増し(昼食込みで100分くらいまでが妥当)、
 * 岡山城90分も水増し(60分くらいが妥当)。それぞれ100分・60分にし、
 * 空いた時間は新しい実在の行き先・岡山県天神山文化プラザ(前川國男設計の
 * 近代建築)と岡山神社(貞観年間創建の古社)を、岡山県立博物館と岡山後楽園の
 * 間に追加して埋めた。
 *
 * 新規に追加したスポットの座標(Nominatim名前検索で確認):
 * - 岡山県天神山文化プラザ: 34.6683519,133.9296294 / 岡山神社: 34.6676822,133.9314213
 *
 * 開いたURL(事実確認):
 * - 岡山県天神山文化プラザ(前川國男設計・1962年完成・2005年リニューアル): https://www.bunka.go.jp/kindai/kenzoubutsu/research/okayama/003/index.html
 * - 岡山神社(貞観年間創建・もと岡山城本丸・1573年宇喜多直家が遷座): https://www.okayama-jinjya.or.jp/about.html
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const MUSEUM_FROM = "この後は、歩いておよそ8分、岡山後楽園へ向かいましょう。";
const MUSEUM_TO = "この後は、歩いておよそ8分、岡山県天神山文化プラザへ向かいましょう。";

const TENJINYAMA_MEMO =
  "岡山県立博物館から歩いておよそ8分、岡山県天神山文化プラザに着きます。ル・コルビュジエのもとで学んだ日本の近代建築家・前川國男の設計で、昭和37年(1962)に完成した県の文化施設です。黄色に彩られた1階のピロティや、吹き抜けのレリーフなど、前川建築ならではの鮮やかな色使いが随所に見られます。平成17年(2005)にはリニューアルも行われ、展示室やホールでは、美術展や公演などさまざまな文化活動が行われています。この後は、歩いておよそ4分、岡山神社へ向かいましょう。";

const OKAYAMAJINJA_MEMO =
  "岡山県天神山文化プラザから歩いておよそ4分、岡山神社に着きます。貞観年間(859〜877)の創建と伝わる古社で、もとは岡山城本丸の地に鎮座していました。天正元年(1573)、岡山城を築くことになった宇喜多直家によって、現在の社地に遷されました。倭迹迹日百襲姫命や日本武尊など複数の神々とともに、岡山藩主・池田光政も祭神として祀られています。参拝の際は、敬意を込めて手を合わせましょう。この後は、歩いておよそ10分、岡山後楽園へ向かいましょう。";

const KORAKUEN_FROM = "岡山県立博物館から歩いておよそ8分、岡山後楽園に着きます。";
const KORAKUEN_TO = "岡山神社から歩いておよそ10分、岡山後楽園に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '62d86c73%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const museum = await findSpotInItinerary(itinId, { spotName: "岡山県立博物館" });
  const korakuen = await findSpotInItinerary(itinId, { spotName: "岡山後楽園" });
  const castle = await findSpotInItinerary(itinId, { spotName: "岡山城" });
  const hayashibara = await findSpotInItinerary(itinId, { spotName: "林原美術館" });

  if (!museum.memo!.includes(MUSEUM_FROM)) throw new Error("岡山県立博物館の文言が想定外です");
  if (!korakuen.memo!.includes(KORAKUEN_FROM)) throw new Error("岡山後楽園の文言が想定外です");

  const museumMemo = museum.memo!.replace(MUSEUM_FROM, MUSEUM_TO);
  const korakuenMemo = korakuen.memo!.replace(KORAKUEN_FROM, KORAKUEN_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: museum.id, data: { memo: museumMemo } },
    {
      create: {
        name: "岡山県天神山文化プラザ",
        address: "岡山県岡山市北区石関町",
        lat: 34.6683519,
        lng: 133.9296294,
        memo: TENJINYAMA_MEMO,
        visitTime: t(10, 18),
        stayDurationMin: 90,
        transitMode: "walk",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
    {
      create: {
        name: "岡山神社",
        address: "岡山県岡山市北区石関町",
        lat: 34.6676822,
        lng: 133.9314213,
        memo: OKAYAMAJINJA_MEMO,
        visitTime: t(11, 52),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
    { id: korakuen.id, data: { memo: korakuenMemo, visitTime: t(12, 42), stayDurationMin: 100, transitMode: "walk", transitDurationMin: 10, transitLine: null } },
    { id: castle.id, data: { visitTime: t(14, 26), stayDurationMin: 60 } },
    { id: hayashibara.id, data: { visitTime: t(15, 32) } },
  ];

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

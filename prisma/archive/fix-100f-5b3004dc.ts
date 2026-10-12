/**
 * #100 5b3004dc の直し(6回目)。企画運営(2026-10-01 10:11)の指摘:
 * 上高地温泉ホテル130分も水増し(日帰り入浴で60分くらいが妥当。昼食込みなら
 * そう書く)。70分にし(昼食を含む旨は既存文に「ここで昼食にしましょう」と
 * 明記済み)、空いた時間は、さらに新しい実在の行き先・田代橋/穂高橋(大正池と
 * 河童橋を結ぶ道にある、梓川に架かる2つの橋)を田代池と温泉ホテルの間に
 * 追加して埋めた(時間を延ばすのではなく、行き先を足す形)。
 *
 * 新規に追加したスポットの座標(OSM生APIで、大正池-河童橋間のbboxから
 * 実在のway「田代橋」のノード座標を確認。穂高橋はすぐ隣接するため同じ
 * スポットとして扱う):
 * - 田代橋・穂高橋: 36.2441274,137.6250064
 *
 * 開いたURL(事実確認):
 * - 田代橋・穂高橋(梓川の中州をはさむ双子橋・穂高連峰を望む撮影地): https://www.walkerplus.com/spot/ar0420s203155/
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TASHIROIKE_FROM = "この後は、歩いておよそ20分、上高地温泉ホテルへ向かいましょう。";
const TASHIROIKE_TO = "この後は、歩いておよそ18分、田代橋・穂高橋へ向かいましょう。";

const HASHI_MEMO =
  "田代池から歩いておよそ18分、田代橋・穂高橋に着きます。梓川が中州をはさんで二筋に分かれるあたりに架かる、双子のような2つの橋です。梓川の左岸から中州へ渡る橋が田代橋、中州から右岸へ渡る橋が穂高橋と呼ばれています。橋の上からは、川上に連なる穂高連峰の姿を望むことができ、大正池から河童橋へと歩く道のりの中でも、人気の撮影地として親しまれています。この後は、歩いておよそ5分、上高地温泉ホテルへ向かいましょう。";

const ONSEN_FROM = "田代池から歩いておよそ20分、上高地温泉ホテルに着きます。";
const ONSEN_TO = "田代橋・穂高橋から歩いておよそ5分、上高地温泉ホテルに着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5b3004dc%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const taishoike = await findSpotInItinerary(itinId, { spotName: "大正池" });
  const tashiroike = await findSpotInItinerary(itinId, { spotName: "田代池" });
  const onsen = await findSpotInItinerary(itinId, { spotName: "上高地温泉ホテル" });
  const okumiya = await findSpotInItinerary(itinId, { spotName: "穂高神社奥宮" });
  const myojinike = await findSpotInItinerary(itinId, { spotName: "明神池" });

  if (!tashiroike.memo!.includes(TASHIROIKE_FROM)) throw new Error("田代池の文言が想定外です");
  if (!onsen.memo!.includes(ONSEN_FROM)) throw new Error("上高地温泉ホテルの文言が想定外です");

  const tashiroikeMemo = tashiroike.memo!.replace(TASHIROIKE_FROM, TASHIROIKE_TO);
  const onsenMemo = onsen.memo!.replace(ONSEN_FROM, ONSEN_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: taishoike.id, data: {} },
    { id: tashiroike.id, data: { memo: tashiroikeMemo } },
    {
      create: {
        name: "田代橋・穂高橋",
        address: "長野県松本市安曇上高地",
        lat: 36.2441274,
        lng: 137.6250064,
        memo: HASHI_MEMO,
        visitTime: t(11, 28),
        stayDurationMin: 55,
        transitMode: "walk",
        transitDurationMin: 18,
        transitLine: null,
      },
    },
    { id: onsen.id, data: { memo: onsenMemo, visitTime: t(12, 28), stayDurationMin: 70, transitMode: "walk", transitDurationMin: 5, transitLine: null } },
    { id: okumiya.id, data: { visitTime: t(14, 13) } },
    { id: myojinike.id, data: { visitTime: t(15, 8) } },
  ];

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
